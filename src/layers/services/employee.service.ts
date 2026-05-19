import { employeeRepository } from '../repositories/employee.repository';
import { userRepository } from '../repositories/user.repository';
import { authService } from './auth.service';
import type { RegisterEmployeeInput } from '../models/auth.model';
import { NotFoundError, ConflictError } from '../middlewares/error.middleware';
import { db } from '../../database/connection';

export const employeeService = {
  async getAllEmployees(page: number = 1, limit: number = 10) {
    const list = await employeeRepository.findAllWithUsers(page, limit);
    const total = await employeeRepository.countAll();
    const totalPages = Math.ceil(total / limit);

    const items = list.map((emp) => {
      const isComplete = !!(emp.phoneNumber && emp.address);
      return {
        id: emp.id,
        nik: emp.nik,
        name: emp.name,
        email: emp.email,
        statusPengisian: isComplete ? 'Lengkap' : 'Belum Lengkap',
      };
    });

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async createEmployee(data: RegisterEmployeeInput) {
    return await authService.registerEmployee(data);
  },

  async updateEmployee(id: number, data: { nik: string; name: string; email: string }) {
    // 1. Find employee
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // 2. Check NIK uniqueness (excluding current employee)
    const existingEmployeeByNik = await employeeRepository.findByNik(data.nik);
    if (existingEmployeeByNik && existingEmployeeByNik.id !== id) {
      throw new ConflictError('NIK already registered');
    }

    // 3. Check Email uniqueness (excluding current user)
    const existingUserByEmail = await userRepository.findByEmail(data.email);
    if (existingUserByEmail && existingUserByEmail.id !== employee.userId) {
      throw new ConflictError('Email already registered');
    }

    // 4. Update in transaction
    const result = await db.transaction(async (tx) => {
      // Update employee
      const updatedEmployee = await employeeRepository.update(id, { nik: data.nik });
      // Update user
      const updatedUser = await userRepository.update(employee.userId, {
        name: data.name,
        email: data.email,
      });

      if (!updatedEmployee || !updatedUser) {
        throw new Error('Update failed');
      }

      return {
        id: updatedEmployee.id,
        nik: updatedEmployee.nik,
        name: updatedUser.name,
        email: updatedUser.email,
      };
    });

    return result;
  },

  async deleteEmployee(id: number) {
    // 1. Find employee
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // 2. Delete user (cascades to employee)
    await userRepository.delete(employee.userId);
    return {
      message: 'Employee deleted successfully',
    };
  },
};

