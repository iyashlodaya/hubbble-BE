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

const getWaitlistSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time', },
            },
            },
            additionalProperties: false,
        },
      },
    },
  },
};

const getWaitlistCountSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
          },
        },
        additionalProperties: false,
      },
      additionalProperties: false,
    },
  },
};

async function waitlistRoutes(fastify) {
  fastify.post('/waitlist', { schema: joinWaitlistSchema }, WaitlistController.join);

  fastify.get('/waitlist', { schema: getWaitlistSchema }, WaitlistController.getWaitlist);
  fastify.get('/waitlist/count', { schema: getWaitlistCountSchema }, WaitlistController.getCount);
}


module.exports = waitlistRoutes;
