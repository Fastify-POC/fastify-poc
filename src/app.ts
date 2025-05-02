import fastify, { FastifyError, FastifyInstance } from 'fastify';
import { LOGGING_CONFIG, SERVER_CONFIG } from '@/config/index';
import fastifyCors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import { envSchema } from '@/schema/env.schema';
import { initializeRoutes } from '@/plugins/initializeRoutes';

export default class App {
  public app: FastifyInstance;

  constructor() {
    this.app = fastify({
      logger: LOGGING_CONFIG.LOGGER
    });

    this.init();
  }

  public async listen() {
    try {
      await this.app.listen({ port: SERVER_CONFIG.PORT });
    } catch (err) {
      this.app.log.error(err);
      process.exit(1);
    }
  }

  private init() {
    this.initializePlugins();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializePlugins() {
    this.app.register(fastifyEnv, { dotenv: true, schema: envSchema });
    this.app.register(fastifyCors, {
      origin: SERVER_CONFIG.ORIGIN,
      credentials: SERVER_CONFIG.CREDENTIALS === 'true',
      methods: SERVER_CONFIG.ALLOWED_METHODS
    });
  }

  private initializeRoutes() {
    this.app.register(initializeRoutes, {
      prefix: `api/${SERVER_CONFIG.API_VERSION}`
    });
  }

  private initializeErrorHandling() {
    this.app.setErrorHandler((error: FastifyError, request, reply) => {
      const status: number = error.statusCode ?? 500;
      const message: string =
        status === 500
          ? 'Something went wrong'
          : (error.message ?? 'Something went wrong');

      this.app.log.error(
        `[${request.method}] ${request.url} >> StatusCode:: ${status}, Message:: ${message}`
      );

      return reply.status(status).send({ error: true, message });
    });
  }
}
