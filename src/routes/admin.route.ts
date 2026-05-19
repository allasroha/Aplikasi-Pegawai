import { Elysia } from 'elysia';
import { employeeController } from '../layers/controllers/employee.controller';
import { adminCreateEmployeeSchema } from '../layers/models/auth.model';
import { authMiddleware } from '../layers/middlewares/auth.middleware';

export const adminRoute = new Elysia({ prefix: '/admin' })
  .use(authMiddleware)
  .get('/employees', employeeController.getAll, {
    beforeHandle: async ({ isAdmin }) => {
      await isAdmin();
    },
  })
  .post('/employees', employeeController.create, {
    body: adminCreateEmployeeSchema,
    beforeHandle: async ({ isAdmin }) => {
      await isAdmin();
    },
  });
