import { FastifyReply, FastifyRequest } from 'fastify';

export default class HealthCheckController {
  public static index = (req: FastifyRequest, reply: FastifyReply): void => {
    console.log('💥💥 Health Check received');
    reply.send('health-check');
  };
}
