const BrandingController = require('../controllers/branding.controller');
const requireAuth = require('../middlewares/requireAuth');

const upsertBrandingSchema = {
  body: {
    type: 'object',
    required: ['name', 'accent_color', 'avatar_type'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      tagline: { type: ['string', 'null'], maxLength: 255 },
      accent_color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
      avatar_type: { type: 'string', enum: ['initials', 'image', 'emoji'] },
      avatar_value: { type: ['string', 'null'], maxLength: 500 },
    },
    additionalProperties: false,
  },
};

async function brandingRoutes(fastify) {
  fastify.get(
    '/branding',
    {
      preHandler: requireAuth,
    },
    BrandingController.getMyBranding
  );

  fastify.put(
    '/branding',
    {
      preHandler: requireAuth,
      schema: upsertBrandingSchema,
    },
    BrandingController.upsertMyBranding
  );
}

module.exports = brandingRoutes;
