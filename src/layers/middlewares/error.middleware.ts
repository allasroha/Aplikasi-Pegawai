import { Elysia } from 'elysia';
import { ZodError } from 'zod';

export const errorMiddleware = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    console.error(`[${code}] Error:`, error);
    if (error instanceof ZodError) {
      set.status = 400;
      return {
        status: 'error',
        message: 'Validation error',
        errors: error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      };
    }

    if (error instanceof Error && error.message === 'User not found') {
      set.status = 404;
      return {
        status: 'error',
        message: error.message,
      };
    }

    set.status = 500;
    return {
      status: 'error',
      message: (error as any).message || 'Internal server error',
    };
  });
