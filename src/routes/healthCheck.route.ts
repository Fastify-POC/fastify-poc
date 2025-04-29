import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@/interfaces/routes.interface';
import HealthCheckController from '@/controllers/healthCheck.controller';
import { healthCheckSchema } from '@/schema/healthCheck.schema';

export default class HealthCheckRoute implements Routes {
  public path = '/';
  public indexController = new HealthCheckController();

  public initializeRoutes(
    fastify: FastifyInstance,
    opts: RouteOptions,
    done: () => void
  ) {
    fastify.route({
      method: 'GET',
      url: `${this.path}health-check`,
      schema: healthCheckSchema,
      handler: HealthCheckController.index
    });
    done();
  }
}
