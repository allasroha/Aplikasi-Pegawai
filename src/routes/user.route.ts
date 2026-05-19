import { Elysia, t } from 'elysia';
import { userController } from '../layers/controllers/user.controller';
import { createUserSchema, updateUserSchema } from '../layers/models/user.model';

export const userRoute = new Elysia({ prefix: '/users' })
  .get('/', userController.getAll)
  .get('/:id', userController.getById, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .post('/', userController.create, {
    body: createUserSchema,
  })
  .put('/:id', userController.update, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: updateUserSchema,
  })
  .delete('/:id', userController.delete, {
    params: t.Object({
      id: t.Numeric(),
    }),
  });
