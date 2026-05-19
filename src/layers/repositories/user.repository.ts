import { eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import { users } from '../../database/schema';
import type { CreateUserInput, UpdateUserInput } from '../models/user.model';

export const userRepository = {
  async findAll() {
    return await db.select().from(users);
  },

  async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  async create(data: CreateUserInput) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  async update(id: number, data: UpdateUserInput) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  },

  async delete(id: number) {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  },
};
