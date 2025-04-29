import { FastifyInstance, RouteOptions } from 'fastify';
import SummaryController from '@/controllers/summary.controller';
import { Routes } from '@/interfaces/routes.interface';

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
      schema: {
        body: {
          type: 'object',
          properties: {
            text: { type: 'string' }
          },
          required: ['text']
        },
        response: {
          200: {
            description: 'Open ai summary response',
            type: 'object',
            properties: {
              summary: { type: 'string' }
            },
            required: ['summary'],
            example: {
              summary: 'This is a summary of the text provided.'
            }
          }
        }
      },
      handler: SummaryController.summarize
    });

    done();
  }
}
