import { userService } from '../services/user.service';
import { createUserSchema, updateUserSchema } from '../models/user.model';

export const userController = {
  async getAll() {
    return await userService.getAllUsers();
  },

  async getById({ params: { id } }: { params: { id: string } }) {
    return await userService.getUserById(parseInt(id));
  },

  async create({ body }: { body: any }) {
    const validatedData = createUserSchema.parse(body);
    return await userService.createUser(validatedData);
  },

  async update({ params: { id }, body }: { params: { id: string }, body: any }) {
    const validatedData = updateUserSchema.parse(body);
    return await userService.updateUser(parseInt(id), validatedData);
  },

  async delete({ params: { id } }: { params: { id: string } }) {
    return await userService.deleteUser(parseInt(id));
  },
};
