import { Elysia } from 'elysia';
import { ZodError } from 'zod';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
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

    if (error instanceof UnauthorizedError) {
      set.status = 401;
      return {
        status: 'error',
        message: error.message,
      };
    }

    if (error instanceof ForbiddenError) {
      set.status = 403;
      return {
        status: 'error',
        message: error.message,
      };
    }

    if (error instanceof ConflictError) {
      set.status = 409;
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
