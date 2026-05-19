import { t, type Static } from 'elysia';

export const loginSchema = t.Object({
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  password: t.String({ minLength: 6, error: 'Password must be at least 6 characters long' }),
});

export const registerEmployeeSchema = t.Object({
  name: t.String({ minLength: 1, error: 'Name is required' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  nik: t.String({ minLength: 10, error: 'NIK must be at least 10 characters long' }),
  password: t.String({ minLength: 6, error: 'Password must be at least 6 characters long' }),
});

export const adminCreateEmployeeSchema = t.Object({
  nama: t.String({ minLength: 1, error: 'Nama is required' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  nik: t.String({ minLength: 10, error: 'NIK must be at least 10 characters long' }),
  password_sementara: t.String({ minLength: 6, error: 'Password sementara must be at least 6 characters long' }),
});

export type LoginInput = Static<typeof loginSchema>;
export type RegisterEmployeeInput = Static<typeof registerEmployeeSchema>;
export type AdminCreateEmployeeInput = Static<typeof adminCreateEmployeeSchema>;
