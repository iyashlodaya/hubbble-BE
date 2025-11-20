require('dotenv').config();
const buildServer = require('./app');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server started on http://${HOST}:${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
