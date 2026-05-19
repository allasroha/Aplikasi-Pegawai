import { employeeRepository } from '../repositories/employee.repository';
import { authService } from './auth.service';
import type { RegisterEmployeeInput } from '../models/auth.model';

export const employeeService = {
  async getAllEmployees() {
    const list = await employeeRepository.findAllWithUsers();
    return list.map((emp) => {
      const isComplete = !!(emp.phoneNumber && emp.address);
      return {
        nik: emp.nik,
        name: emp.name,
        email: emp.email,
        statusPengisian: isComplete ? 'Lengkap' : 'Belum Lengkap',
      };
    });
  },

  async createEmployee(data: RegisterEmployeeInput) {
    return await authService.registerEmployee(data);
  },
};
