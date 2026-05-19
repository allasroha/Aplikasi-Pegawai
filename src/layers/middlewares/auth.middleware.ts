import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { env } from '../../config/env';
import { UnauthorizedError, ForbiddenError } from './error.middleware';

export const authMiddleware = (app: Elysia) =>
  app
    .use(
      jwt({
        name: 'jwt',
        secret: env.JWT_SECRET,
      })
    )
    .derive(({ headers, jwt }) => {
      const isAuthenticated = async () => {
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedError('Missing or invalid Authorization header');
        }
        const token = authHeader.substring(7);
        const payload = await jwt.verify(token);
        if (!payload) {
          throw new UnauthorizedError('Invalid or expired token');
        }
        return payload as { id: number; email: string; role: string; name: string };
      };

      const isAdmin = async () => {
        const user = await isAuthenticated();
        if (user.role !== 'admin') {
          throw new ForbiddenError('Access denied: Admin role required');
        }
        return user;
      };

      const isEmployee = async () => {
        const user = await isAuthenticated();
        if (user.role !== 'employee') {
          throw new ForbiddenError('Access denied: Employee role required');
        }
        return user;
      };

      return {
        isAuthenticated,
        isAdmin,
        isEmployee,
      };
    });
