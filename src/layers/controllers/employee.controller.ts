import { employeeService } from '../services/employee.service';
import type { AdminCreateEmployeeInput, AdminUpdateEmployeeInput } from '../models/auth.model';

export const employeeController = {
  async getAll({ query }: { query: Record<string, string | undefined> }) {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
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

  async update({ params, body }: { params: { id: string }; body: AdminUpdateEmployeeInput }) {
    const id = parseInt(params.id, 10);
    const data = await employeeService.updateEmployee(id, {
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

  async delete({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    await employeeService.deleteEmployee(id);
    return {
      status: 'success',
      message: 'Employee deleted successfully',
    };
  },
};

