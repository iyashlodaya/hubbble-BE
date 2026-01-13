const ProjectFileService = require('../services/project_file.service.js');

class ProjectFileController {
    static async listFiles(request, reply) {
        try {
            const { id: projectId } = request.params;
            const userId = request.user?.id;
            const files = await ProjectFileService.listFiles(projectId, userId);
            return reply.code(200).send({
                message: 'Files fetched successfully',
                data: files,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to fetch files');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to fetch files' });
        }
    }

    static async createFile(request, reply) {
        try {
            const { id: projectId } = request.params;
            const userId = request.user?.id;
            const file = await ProjectFileService.createFile(projectId, userId, request.body);
            return reply.code(201).send({
                message: 'File created successfully',
                data: file,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to create file');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to create file' });
        }
    }

    static async deleteFile(request, reply) {
        try {
            const { id, fileId } = request.params;
            const targetId = fileId || id;
            const userId = request.user?.id;
            await ProjectFileService.deleteFile(targetId, userId);
            return reply.code(204).send();
        } catch (error) {
            request.log.error({ err: error }, 'Failed to delete file');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to delete file' });
        }
    }
}

module.exports = ProjectFileController;
