const WaitlistController = require('../controllers/waitlist.controller');

const joinWaitlistSchema = {
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

async function waitlistRoutes(fastify) {
  fastify.post('/waitlist', { schema: joinWaitlistSchema }, WaitlistController.join);
}

module.exports = waitlistRoutes;
