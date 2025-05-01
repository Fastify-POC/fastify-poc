import { FastifyInstance, RouteOptions } from 'fastify';

export interface Routes {
  path: string;
  initializeRoutes: (
    _fastify: FastifyInstance,
    _opts: RouteOptions,
    _done: () => void
  ) => void;
}
