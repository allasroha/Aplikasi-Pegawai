import { authService } from '../services/auth.service';
import type { LoginInput, RegisterEmployeeInput } from '../models/auth.model';

export const authController = {
  async login({ body, jwt }: { body: LoginInput; jwt: any }) {
    const user = await authService.login(body);
    const token = await jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user,
      },
    };
  },

  async register({ body }: { body: RegisterEmployeeInput }) {
    const result = await authService.registerEmployee(body);
    return {
      status: 'success',
      message: 'Employee registered successfully',
      data: result,
    };
  },
};
