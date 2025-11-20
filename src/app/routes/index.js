const fp = require('fastify-plugin');
const waitlistRoutes = require('./waitlist.routes');

async function routes(fastify) {
  fastify.get('/health', async () => ({ status: 'ok' }));

  await fastify.register(waitlistRoutes, { prefix: '/api/v1' });
}

module.exports = fp(routes);
