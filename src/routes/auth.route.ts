import { Elysia } from 'elysia';
import { authController } from '../layers/controllers/auth.controller';
import { loginSchema, registerEmployeeSchema } from '../layers/models/auth.model';
import { authMiddleware } from '../layers/middlewares/auth.middleware';

export const authRoute = new Elysia({ prefix: '/auth' })
  .use(authMiddleware)
  .post('/login', authController.login, {
    body: loginSchema,
  })
  .post('/register', authController.register, {
    body: registerEmployeeSchema,
    beforeHandle: async ({ isAdmin }) => {
      await isAdmin();
    },
  });
