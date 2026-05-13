import postgres from 'postgres';
import { env } from './src/config/env';

async function test() {
  console.log('Connecting to:', env.DATABASE_URL);
  const sql = postgres(env.DATABASE_URL);
  try {
    const result = await sql`SELECT 1`;
    console.log('Connection successful:', result);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await sql.end();
  }
}

test();
