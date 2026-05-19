import { db } from './connection';
import { users } from './schema';
import { env } from '../config/env';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding database...');
  try {
    // Check if admin already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, env.ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin) {
      console.log(`Admin user with email ${env.ADMIN_EMAIL} already exists.`);
      process.exit(0);
    }

    const hashedPassword = await Bun.password.hash(env.ADMIN_PASSWORD);

    await db.insert(users).values({
      name: 'Admin',
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log(`Admin user seeded successfully with email: ${env.ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
