import { userRepository } from '../repositories/user.repository';
import type { CreateUserInput, UpdateUserInput } from '../models/user.model';

export const userService = {
  async getAllUsers() {
    return await userRepository.findAll();
  },

  async getUserById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async createUser(data: CreateUserInput) {
    return await userRepository.create(data);
  },

  async updateUser(id: number, data: UpdateUserInput) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return await userRepository.update(id, data);
  },

  async deleteUser(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return await userRepository.delete(id);
  },
};
