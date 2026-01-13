const PublicPortalService = require('../services/public_portal.service.js');

class PublicPortalController {
    static async getPublicPortal(request, reply) {
        try {
            const { slug } = request.params;
            const portalData = await PublicPortalService.getPublicPortal(slug);
            return reply.code(200).send({
                message: 'Public portal data fetched successfully',
                data: portalData,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to fetch public portal data');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to fetch public portal data' });
        }
    }
}

module.exports = PublicPortalController;
