import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { app } from "./app";
import { db } from "./database/connection";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { env } from "./config/env";

describe("API End-to-End Tests", () => {
  let adminToken: string = "";
  let employeeToken: string = "";
  const testEmployeeEmail = "e2e_employee@example.com";
  const testEmployeeNik = "987654321012345";
  let createdEmployeeId: number | null = null;
  let empId: number | null = null;

  beforeAll(async () => {
    // 1. Clean up test employee if exists
    const [existing] = await db.select().from(users).where(eq(users.email, testEmployeeEmail)).limit(1);
    if (existing) {
      await db.delete(users).where(eq(users.id, existing.id));
    }

    // 2. Login as admin to get admin token
    const loginResponse = await app.handle(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: env.ADMIN_EMAIL,
          password: env.ADMIN_PASSWORD,
        }),
      })
    );
    const body = (await loginResponse.json()) as any;
    adminToken = body.data.token;
  });

  afterAll(async () => {
    if (createdEmployeeId) {
      await db.delete(users).where(eq(users.id, createdEmployeeId));
    }
  });

  describe("POST /api/auth/login", () => {
    it("should return JWT token on successful login", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: env.ADMIN_EMAIL,
            password: env.ADMIN_PASSWORD,
          }),
        })
      );

      expect(response.status).toBe(200);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("success");
      expect(resBody.data.token).toBeDefined();
      expect(resBody.data.user.role).toBe("admin");
    });

    it("should return validation error on invalid email", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "invalid-email",
            password: env.ADMIN_PASSWORD,
          }),
        })
      );

      expect(response.status).toBe(400);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("error");
      expect(resBody.message).toBe("Validation error");
    });
  });

  describe("POST /api/admin/employees", () => {
    it("should deny access if authorization header is missing", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: "E2E Employee",
            email: testEmployeeEmail,
            nik: testEmployeeNik,
            password_sementara: "tempPass123",
          }),
        })
      );

      expect(response.status).toBe(401);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("error");
      expect(resBody.message).toContain("Authorization");
    });

    it("should allow admin to create employee and return employee details", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            nama: "E2E Employee",
            email: testEmployeeEmail,
            nik: testEmployeeNik,
            password_sementara: "tempPass123",
          }),
        })
      );

      expect(response.status).toBe(200);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("success");
      expect(resBody.data.email).toBe(testEmployeeEmail);
      expect(resBody.data.employee.nik).toBe(testEmployeeNik);

      createdEmployeeId = resBody.data.id;
      empId = resBody.data.employee.id;

      // Login as this new employee to get an employee role token
      const empLoginResponse = await app.handle(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testEmployeeEmail,
            password: "tempPass123",
          }),
        })
      );
      const empLoginBody = (await empLoginResponse.json()) as any;
      employeeToken = empLoginBody.data.token;
    });

    it("should deny access if authorized user is employee (not admin)", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
          body: JSON.stringify({
            nama: "E2E Employee 2",
            email: "e2e_employee_2@example.com",
            nik: "111112222233333",
            password_sementara: "tempPass123",
          }),
        })
      );

      expect(response.status).toBe(403);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("error");
      expect(resBody.message).toContain("Admin role required");
    });
  });

  describe("GET /api/admin/employees", () => {
    it("should allow admin to list all employees", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "GET",
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("success");
      expect(resBody.data.items).toBeInstanceOf(Array);
      expect(resBody.data.items.length).toBeGreaterThan(0);
      expect(resBody.data.pagination).toBeDefined();
      expect(resBody.data.pagination.page).toBe(1);
      expect(resBody.data.pagination.limit).toBe(10);
      
      const found = resBody.data.items.find((e: any) => e.nik === testEmployeeNik);
      expect(found).toBeDefined();
      expect(found.name).toBe("E2E Employee");
      expect(found.statusPengisian).toBe("Belum Lengkap");
    });

    it("should deny employee from listing all employees", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "GET",
          headers: { Authorization: `Bearer ${employeeToken}` },
        })
      );

      expect(response.status).toBe(403);
    });
  });

  describe("PUT /api/admin/employees/:id", () => {
    it("should allow admin to update employee details", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/admin/employees/${empId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            nama: "Updated Employee Name",
            email: "updated_employee@example.com",
            nik: "987654321012349",
          }),
        })
      );

      expect(response.status).toBe(200);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("success");
      expect(resBody.data.name).toBe("Updated Employee Name");
      expect(resBody.data.email).toBe("updated_employee@example.com");
      expect(resBody.data.nik).toBe("987654321012349");
    });

    it("should deny employee from updating employee details", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/admin/employees/${empId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
          body: JSON.stringify({
            nama: "Attempted Name Update",
            email: "updated_employee@example.com",
            nik: "987654321012349",
          }),
        })
      );

      expect(response.status).toBe(403);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should blacklist token and deny subsequent authenticated requests", async () => {
      const logoutResponse = await app.handle(
        new Request("http://localhost/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${employeeToken}` },
        })
      );

      expect(logoutResponse.status).toBe(200);
      const logoutBody = (await logoutResponse.json()) as any;
      expect(logoutBody.status).toBe("success");

      const checkResponse = await app.handle(
        new Request("http://localhost/api/admin/employees", {
          method: "GET",
          headers: { Authorization: `Bearer ${employeeToken}` },
        })
      );

      expect(checkResponse.status).toBe(401);
      const checkBody = (await checkResponse.json()) as any;
      expect(checkBody.message).toContain("invalidated");
    });
  });

  describe("DELETE /api/admin/employees/:id", () => {
    it("should deny employee from deleting employee", async () => {
      const empLoginResponse = await app.handle(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "updated_employee@example.com",
            password: "tempPass123",
          }),
        })
      );
      const empLoginBody = (await empLoginResponse.json()) as any;
      const freshEmployeeToken = empLoginBody.data.token;

      const response = await app.handle(
        new Request(`http://localhost/api/admin/employees/${empId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${freshEmployeeToken}` },
        })
      );
      expect(response.status).toBe(403);
    });

    it("should allow admin to delete employee", async () => {
      const response = await app.handle(
        new Request(`http://localhost/api/admin/employees/${empId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );

      expect(response.status).toBe(200);
      const resBody = (await response.json()) as any;
      expect(resBody.status).toBe("success");

      const checkResponse = await app.handle(
        new Request(`http://localhost/api/admin/employees`, {
          method: "GET",
          headers: { Authorization: `Bearer ${adminToken}` },
        })
      );
      const checkBody = (await checkResponse.json()) as any;
      const found = checkBody.data.items.find((e: any) => e.id === empId);
      expect(found).toBeUndefined();
    });
  });
});
