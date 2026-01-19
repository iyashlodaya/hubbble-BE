const ProjectUpdateService = require('../services/project_update.service.js');

class ProjectUpdateController {
    static async listUpdates(request, reply) {
        try {
            const { id: projectId } = request.params;
            const userId = request.user?.id;
            const updates = await ProjectUpdateService.listUpdates(projectId, userId);
            return reply.code(200).send({
                message: 'Updates fetched successfully',
                data: updates,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to fetch updates');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to fetch updates' });
        }
    }

    static async createUpdate(request, reply) {
        try {
            const { id: projectId } = request.params;
            const userId = request.user?.id;
            const update = await ProjectUpdateService.createUpdate(projectId, userId, request.body);
            return reply.code(201).send({
                message: 'Update created successfully',
                data: update,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to create update');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to create update' });
        }
    }

    static async deleteUpdate(request, reply) {
        try {
            console.log("**** deleteUpdate controller ****", request.params);
            const { id, updateId } = request.params;
            const userId = request.user?.id;
            console.log("**** deleteUpdate  controller 2 ****", updateId, id, userId);
            const deletedUpdate = await ProjectUpdateService.deleteUpdate(id, updateId, userId);
            return reply.code(200).send({
                message: 'Update deleted successfully',
                data: deletedUpdate,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to delete update');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to delete update' });
        }
    }
}

module.exports = ProjectUpdateController;
