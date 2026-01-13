const fp = require('fastify-plugin');
const waitlistRoutes = require('./waitlist.routes');
const authRoutes = require('./auth.routes');
const clientRoutes = require('./client.routes');
const projectRoutes = require('./project.routes');
const publicPortalRoutes = require('./public_portal.routes');

async function routes(fastify) {
  fastify.get('/health', async () => ({ status: 'ok' }));

  await fastify.register(waitlistRoutes, { prefix: '/api/v1' })
  await fastify.register(authRoutes, { prefix: '/api/v1' });
  await fastify.register(clientRoutes, { prefix: '/api/v1' })
  await fastify.register(projectRoutes, { prefix: '/api/v1' })
  await fastify.register(publicPortalRoutes, { prefix: '/api/v1' })
}

module.exports = fp(routes);
