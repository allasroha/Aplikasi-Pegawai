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
      expect(resBody.data).toBeInstanceOf(Array);
      expect(resBody.data.length).toBeGreaterThan(0);
      
      const found = resBody.data.find((e: any) => e.nik === testEmployeeNik);
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
});
