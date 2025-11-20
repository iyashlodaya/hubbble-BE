const Fastify = require('fastify');
const cors = require('@fastify/cors');
const routes = require('./routes');

async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(routes);

  return fastify;
}

module.exports = buildServer;
