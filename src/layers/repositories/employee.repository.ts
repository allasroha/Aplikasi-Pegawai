import { eq } from 'drizzle-orm';
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

  async findAllWithUsers() {
    return await db
      .select({
        nik: employees.nik,
        name: users.name,
        email: users.email,
        phoneNumber: employees.phoneNumber,
        address: employees.address,
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id));
  },
};
