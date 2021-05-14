import { rest } from 'msw';

import { Endpoints } from './handlers';
import { server } from './server';

export type RequestMethod = 'get' | 'post' | 'delete';

export const respondServerError = (endpoint: Endpoints, method: RequestMethod = 'get'): void => {
  server.use(
    rest[method](endpoint, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
};
