import { t, type Static } from 'elysia';

export const createUserSchema = t.Object({
  name: t.String({ minLength: 1, error: 'Name is required' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
});

export const updateUserSchema = t.Partial(createUserSchema);

export type CreateUserInput = Static<typeof createUserSchema>;
export type UpdateUserInput = Static<typeof updateUserSchema>;
