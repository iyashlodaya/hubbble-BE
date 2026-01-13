const PublicPortalController = require('../controllers/public_portal.controller.js');

async function publicPortalRoutes(fastify) {
    fastify.get(
        '/public/:slug',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['slug'],
                    properties: {
                        slug: { type: 'string' },
                    },
                    additionalProperties: false,
                },
            },
        },
        PublicPortalController.getPublicPortal
    );
}

module.exports = publicPortalRoutes;
