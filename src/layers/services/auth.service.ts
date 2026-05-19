import { userRepository } from '../repositories/user.repository';
import { employeeRepository } from '../repositories/employee.repository';
import type { LoginInput, RegisterEmployeeInput } from '../models/auth.model';
import { UnauthorizedError, ConflictError } from '../middlewares/error.middleware';
import { db } from '../../database/connection';
import { users, employees } from '../../database/schema';

export const authService = {
  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await Bun.password.verify(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },

  async registerEmployee(data: RegisterEmployeeInput) {
    // 1. Check email uniqueness
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // 2. Check NIK uniqueness
    const existingEmployee = await employeeRepository.findByNik(data.nik);
    if (existingEmployee) {
      throw new ConflictError('NIK already registered');
    }

    // 3. Hash password
    const hashedPassword = await Bun.password.hash(data.password);

    // 4. Create user and employee in transaction
    const result = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'employee',
        })
        .returning();

      if (!newUser) {
        throw new Error('Failed to create user');
      }

      const [newEmployee] = await tx
        .insert(employees)
        .values({
          userId: newUser.id,
          nik: data.nik,
        })
        .returning();

      if (!newEmployee) {
        throw new Error('Failed to create employee');
      }

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        employee: {
          id: newEmployee.id,
          nik: newEmployee.nik,
        },
      };
    });

    return result;
  },
};
