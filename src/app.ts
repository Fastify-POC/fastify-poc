import { FastifyError, FastifyInstance } from 'fastify';
const { SERVER_CONFIG, LOGGING_CONFIG } = require('./config');
const Fastify = require('fastify');
const fastifyCors = require('@fastify/cors');
const fastifyEnv = require('@fastify/env');
const envSchema = require('@/schema/env.schema');
const initializeRoutes = require('@/plugins/initializeRoutes');

module.exports = class App {
  public app: FastifyInstance;

  constructor() {
    this.app = Fastify({
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
      credentials: SERVER_CONFIG.CREDENTIALS === 'true'
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
};
