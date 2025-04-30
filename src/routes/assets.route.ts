import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@/interfaces/routes.interface';
import AssetsController from '@/controllers/assets.controller';

export default class AssetsRoute implements Routes {
  public path = '/assets';
  public indexController = new AssetsController();

  public initializeRoutes(
    fastify: FastifyInstance,
    opts: RouteOptions,
    done: () => void
  ) {
    fastify.route({
      method: 'GET',
      url: `${this.path}/images`,
      schema: {
        querystring: {
          type: 'object',
          properties: {
            filename: { type: 'string' }
          },
          required: ['filename']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      handler: AssetsController.getImageByQuery
    });
    done();
  }
}
