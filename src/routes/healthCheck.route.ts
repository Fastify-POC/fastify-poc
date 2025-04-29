import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@/interfaces/routes.interface';
import HealthCheckController from '@/controllers/healthCheck.controller';

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
      schema: {
        response: {
          200: {
            description: 'Health-check response',
            type: 'object',
            properties: {
              'Health Check': { type: 'boolean' },
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' }
            },
            required: ['Health Check', 'message', 'timestamp'],
            example: {
              'Health Check': true,
              message: 'success',
              timestamp: '2025-04-29T12:00:00.000Z'
            }
          }
        }
      },
      handler: HealthCheckController.index
    });
    done();
  }
}
