import { FastifyReply, FastifyRequest } from 'fastify';

export default class HealthCheckController {
  public static index = (req: FastifyRequest, reply: FastifyReply): void => {
    reply.send({
      'Health Check': true,
      message: 'success',
      timestamp: new Date().toISOString()
    });
  };
}
