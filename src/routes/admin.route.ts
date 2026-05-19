import { Elysia } from 'elysia';
import { employeeController } from '../layers/controllers/employee.controller';
import { adminCreateEmployeeSchema, adminUpdateEmployeeSchema } from '../layers/models/auth.model';
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
  })
  .put('/employees/:id', employeeController.update, {
    body: adminUpdateEmployeeSchema,
    beforeHandle: async ({ isAdmin }) => {
      await isAdmin();
    },
  })
  .delete('/employees/:id', employeeController.delete, {
    beforeHandle: async ({ isAdmin }) => {
      await isAdmin();
    },
  });

