import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@/interfaces/routes.interface';
const HealthCheckController = require('@/controllers/healthCheck.controller');

module.exports = class HealthCheckRoute implements Routes {
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
      schema: {
        response: {
          200: {
            description: 'Successful response',
            type: 'string',
            example: 'ok'
          }
        }
      },
      handler: HealthCheckController.index
    });
    done();
  }
};
