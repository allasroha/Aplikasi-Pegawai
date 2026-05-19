import { db } from './connection';
import { sql } from 'drizzle-orm';

async function reset() {
  console.log('Resetting database...');
  try {
    await db.execute(sql`DROP TABLE IF EXISTS employees CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
    await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);
    console.log('Database tables and drizzle schema dropped successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping tables:', error);
    process.exit(1);
  }
}

reset();
