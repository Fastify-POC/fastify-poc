import { FastifyPluginOptions } from 'fastify';
import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { Routes } from '@/interfaces/routes.interface';
import HealthCheckRoute from '@/routes/healthCheck.route';

export const initializeRoutes: FastifyPluginCallbackTypebox<
  FastifyPluginOptions
> = (server, options, done) => {
  const routes = [new HealthCheckRoute()];

  routes.forEach((route: Routes) => {
    server.register(
      route.initializeRoutes.bind(
        route
      ) as FastifyPluginCallbackTypebox<FastifyPluginOptions>
    );
  });
  done();
};
