import { Elysia } from 'elysia';
import { userController } from '../layers/controllers/user.controller';

export const userRoute = new Elysia({ prefix: '/users' })
  .get('/', userController.getAll)
  .get('/:id', userController.getById)
  .post('/', userController.create)
  .put('/:id', userController.update)
  .delete('/:id', userController.delete);
