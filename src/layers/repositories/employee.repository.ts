import { eq, sql } from 'drizzle-orm';
import { db } from '../../database/connection';
import { employees, users } from '../../database/schema';

export const employeeRepository = {
  async create(data: { userId: number; nik: string }) {
    const result = await db.insert(employees).values(data).returning();
    return result[0];
  },

  async findByNik(nik: string) {
    const result = await db.select().from(employees).where(eq(employees.nik, nik));
    return result[0];
  },

  async findById(id: number) {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  },

  async findAllWithUsers(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return await db
      .select({
        id: employees.id,
        nik: employees.nik,
        name: users.name,
        email: users.email,
        phoneNumber: employees.phoneNumber,
        address: employees.address,
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .limit(limit)
      .offset(offset);
  },

  async countAll() {
    const result = await db.select({ count: sql<number>`count(*)` }).from(employees);
    return Number(result[0]?.count || 0);
  },

  async update(id: number, data: { nik: string }) {
    const result = await db.update(employees).set(data).where(eq(employees.id, id)).returning();
    return result[0];
  },
};

