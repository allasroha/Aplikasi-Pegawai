import { Elysia } from 'elysia';
import { ZodError } from 'zod';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const errorMiddleware = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    console.error(`[${code}] Error:`, error);

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        status: 'error',
        message: 'Validation error',
        errors: error.all ? error.all.map((e) => ({
          path: e.path.replace(/^\//, ''),
          message: e.message,
        })) : [{ path: '', message: error.message }],
      };
    }

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

    if (error instanceof NotFoundError) {
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
