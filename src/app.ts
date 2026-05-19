import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { userRoute } from './routes/user.route';
import { authRoute } from './routes/auth.route';
import { adminRoute } from './routes/admin.route';
import { errorMiddleware } from './layers/middlewares/error.middleware';

export const app = new Elysia()
  .use(cors())
  .use(errorMiddleware)
  .group('/api', (app) => 
    app
      .use(userRoute)
      .use(authRoute)
      .use(adminRoute)
  );

