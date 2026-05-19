import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { authService } from "./auth.service";
import { employeeService } from "./employee.service";
import { db } from "../../database/connection";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import { env } from "../../config/env";

describe("Auth and Employee Service Tests", () => {
  const testEmail = "test_employee_service@example.com";
  const testNik = "123456789012345";
  const testPassword = "testpassword123";
  let createdUserId: number | null = null;

  // Clean up any leftover test user before starting
  beforeAll(async () => {
    const [existing] = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);
    if (existing) {
      await db.delete(users).where(eq(users.id, existing.id));
    }
  });

  // Clean up after all tests finish
  afterAll(async () => {
    if (createdUserId) {
      await db.delete(users).where(eq(users.id, createdUserId));
    }
  });

  describe("authService.login", () => {
    it("should login successfully with valid admin credentials", async () => {
      const result = await authService.login({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      });

      expect(result).toBeDefined();
      expect(result.email).toBe(env.ADMIN_EMAIL);
      expect(result.role).toBe("admin");
      expect(result.id).toBeTypeOf("number");
    });

    it("should throw error if email does not exist", async () => {
      expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "somepassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error if password is incorrect", async () => {
      expect(
        authService.login({
          email: env.ADMIN_EMAIL,
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });
  });

  describe("authService.registerEmployee", () => {
    it("should register a new employee successfully", async () => {
      const result = await authService.registerEmployee({
        name: "Test Employee",
        email: testEmail,
        nik: testNik,
        password: testPassword,
      });

      expect(result).toBeDefined();
      expect(result.email).toBe(testEmail);
      expect(result.role).toBe("employee");
      expect(result.employee).toBeDefined();
      expect(result.employee.nik).toBe(testNik);

      createdUserId = result.id;
    });

    it("should throw error if email is already registered", async () => {
      expect(
        authService.registerEmployee({
          name: "Another Employee",
          email: testEmail,
          nik: "99999999999999",
          password: testPassword,
        })
      ).rejects.toThrow("Email already registered");
    });

    it("should throw error if NIK is already registered", async () => {
      expect(
        authService.registerEmployee({
          name: "Another Employee",
          email: "another_email@example.com",
          nik: testNik,
          password: testPassword,
        })
      ).rejects.toThrow("NIK already registered");
    });
  });

  describe("employeeService", () => {
    it("should fetch all employees with pagination", async () => {
      const result = await employeeService.getAllEmployees(1, 10);
      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBeTypeOf("number");
    });

    it("should throw error if updating non-existent employee", async () => {
      expect(
        employeeService.updateEmployee(999999, {
          name: "Non Existent",
          email: "nonexistent_update@example.com",
          nik: "999999999999999",
        })
      ).rejects.toThrow("Employee not found");
    });

    it("should throw error if deleting non-existent employee", async () => {
      expect(employeeService.deleteEmployee(999999)).rejects.toThrow("Employee not found");
    });
  });
});
