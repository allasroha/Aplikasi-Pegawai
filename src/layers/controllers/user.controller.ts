import { userService } from '../services/user.service';
import type { CreateUserInput, UpdateUserInput } from '../models/user.model';

export const userController = {
  async getAll() {
    return await userService.getAllUsers();
  },

  async getById({ params: { id } }: { params: { id: number } }) {
    return await userService.getUserById(id);
  },

  async create({ body }: { body: CreateUserInput }) {
    return await userService.createUser(body);
  },

  async update({ params: { id }, body }: { params: { id: number }, body: UpdateUserInput }) {
    return await userService.updateUser(id, body);
  },

  async delete({ params: { id } }: { params: { id: number } }) {
    return await userService.deleteUser(id);
  },
};
