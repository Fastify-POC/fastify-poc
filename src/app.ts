import { FastifyReply, FastifyRequest } from 'fastify';

const fastify = require('fastify')({ logger: true });

// Declare a route
fastify.get('/health-check', (request: FastifyRequest, reply: FastifyReply) => {
  console.log('');
  reply.send({ hello: 'world' });
});

// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  } else {
    fastify.log.info(`Server listening on ${fastify.server.address()}`);
    console.log('Server is running on http://localhost:3000/health-check');
  }
});
