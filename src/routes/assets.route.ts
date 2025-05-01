import { FastifyInstance, RouteOptions } from 'fastify';
import { Routes } from '@/interfaces/routes.interface';
import AssetsController from '@/controllers/assets.controller';
import { assetsSchema } from '@/schema/assets.schema';

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
      schema: assetsSchema,
      handler: AssetsController.getImageByQuery
    });
    done();
  }
}
