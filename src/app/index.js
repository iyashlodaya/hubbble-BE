const Fastify = require('fastify');
const cors = require('@fastify/cors');
const routes = require('./routes');

async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  await fastify.register(routes);

  return fastify;
}

module.exports = buildServer;
