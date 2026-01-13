const ClientController = require('../controllers/client.controller');
const requireAuth = require('../middlewares/requireAuth');

const createClientSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email', nullable: true },
    },
    additionalProperties: false,
  },
};

const clientIdParam = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer' },
  },
  additionalProperties: false,
};

const listClientsResponse = {
  200: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
          additionalProperties: true,
        },
      },
    },
  },
};

async function clientRoutes(fastify) {
  fastify.post(
    '/clients',
    {
      preHandler: requireAuth,
      schema: {
        body: createClientSchema.body,
      },
    },
    ClientController.createClient
  );

  fastify.get(
    '/clients',
    {
      preHandler: requireAuth,
      schema: {
        response: listClientsResponse,
      },
    },
    ClientController.listClients
  );

  fastify.get(
    '/clients/:id',
    {
      preHandler: requireAuth,
      schema: {
        params: clientIdParam,
      },
    },
    ClientController.getClientById
  );

  fastify.delete(
    '/clients/:id',
    {
      preHandler: requireAuth,
      schema: {
        params: clientIdParam,
      },
    },
    ClientController.deleteClient
  );
}

module.exports = clientRoutes;
