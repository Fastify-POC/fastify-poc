import { FastifyInstance, RouteOptions } from 'fastify';
import SummaryController from '@/controllers/summary.controller';
import { Routes } from '@/interfaces/routes.interface';
import { summarySchema } from '@/schema/summary.schema';

export default class SummaryRoute implements Routes {
  public path = '/ai';
  public summaryController = new SummaryController();

  public initializeRoutes(
    fastify: FastifyInstance,
    opts: RouteOptions,
    done: () => void
  ) {
    fastify.route({
      method: 'POST',
      url: `${this.path}/summary`,
      schema: summarySchema,
      handler: SummaryController.summarize
    });

    done();
  }
}
