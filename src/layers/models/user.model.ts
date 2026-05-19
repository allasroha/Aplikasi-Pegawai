import { t, type Static } from 'elysia';

export const createUserSchema = t.Object({
  name: t.String({ minLength: 1, error: 'Name is required' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  password: t.String({ minLength: 6, error: 'Password must be at least 6 characters long' }),
  role: t.Optional(t.String()),
});

export const updateUserSchema = t.Partial(createUserSchema);

export type CreateUserInput = Static<typeof createUserSchema>;
export type UpdateUserInput = Static<typeof updateUserSchema>;
