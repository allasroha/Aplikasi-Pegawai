import { employeeService } from '../services/employee.service';
import type { AdminCreateEmployeeInput, AdminUpdateEmployeeInput } from '../models/auth.model';

export const employeeController = {
  async getAll({ query }: { query: { page?: number; limit?: number } }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const data = await employeeService.getAllEmployees(page, limit);
    return {
      status: 'success',
      data,
    };
  },

  async create({ body }: { body: AdminCreateEmployeeInput }) {
    const data = await employeeService.createEmployee({
      name: body.nama,
      email: body.email,
      nik: body.nik,
      password: body.password_sementara,
    });
    return {
      status: 'success',
      message: 'Employee created successfully',
      data,
    };
  },

  async update({ params, body }: { params: { id: number }; body: AdminUpdateEmployeeInput }) {
    const data = await employeeService.updateEmployee(params.id, {
      name: body.nama,
      email: body.email,
      nik: body.nik,
    });
    return {
      status: 'success',
      message: 'Employee updated successfully',
      data,
    };
  },

  async delete({ params }: { params: { id: number } }) {
    await employeeService.deleteEmployee(params.id);
    return {
      status: 'success',
      message: 'Employee deleted successfully',
    };
  },
};

