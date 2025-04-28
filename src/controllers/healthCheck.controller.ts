import { FastifyReply, FastifyRequest } from 'fastify';

module.exports = class HealthCheckController {
  public static index = (req: FastifyRequest, reply: FastifyReply): void => {
    reply.send('health-check');
  };
};
