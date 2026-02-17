const BrandingService = require('../services/branding.service');

class BrandingController {
  static async getMyBranding(request, reply) {
    try {
      const userId = request.user.id;
      const branding = await BrandingService.getByUserId(userId);
      return reply.code(200).send({
        success: true,
        data: branding,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to fetch branding');
      const statusCode = error.statusCode || 500;
      return reply.code(statusCode).send({
        success: false,
        error: error.message || 'Unable to fetch branding',
      });
    }
  }

  static async upsertMyBranding(request, reply) {
    try {
      const userId = request.user.id;
      const branding = await BrandingService.upsert(userId, request.body);
      return reply.code(200).send({
        success: true,
        data: branding,
      });
    } catch (error) {
      request.log.error({ err: error }, 'Failed to upsert branding');
      const statusCode = error.statusCode || 500;
      const response = {
        success: false,
        error: error.message || 'Unable to save branding',
      };
      if (error.details) {
        response.details = error.details;
      }
      return reply.code(statusCode).send(response);
    }
  }
}

module.exports = BrandingController;
