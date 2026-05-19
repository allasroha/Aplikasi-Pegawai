import { employeeService } from '../services/employee.service';
import type { AdminCreateEmployeeInput } from '../models/auth.model';

export const employeeController = {
  async getAll() {
    const data = await employeeService.getAllEmployees();
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
};
