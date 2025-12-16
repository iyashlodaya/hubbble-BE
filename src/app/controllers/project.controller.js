const ProjectService = require('../services/project.service.js');

class ProjectController {
    static async createProject(request, reply) {
        try {
            const { project_name, description, project_status, client_id } = request.body;
            const project = await ProjectService.createProject(client_id, project_name, description, project_status);
            return reply.code(201).send({
                message: 'Project created successfully',
                data: project,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to create project');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to create project' });
        }
    }

    static async listProjects(request, reply) {
        try {
            const userId = request.user?.id;
            const projects = await ProjectService.listProjects(userId);
            return reply.code(200).send({
                message: 'Projects fetched successfully',
                data: projects,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to fetch clients');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to fetch clients' });
        }
    }

    static async getProjectById(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user?.id;
            const project = await ProjectService.getProjectById(id, userId);
            return reply.code(200).send({
                message: 'Project fetched successfully',
                data: project,
            });
        } catch (error) {
            request.log.error({ err: error }, 'Failed to fetch project');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to fetch project' });
        }
    }

    static async deleteProject(request, reply) {
        try {
            const { id } = request.params;
            const userId = request.user?.id;
            await ProjectService.deleteProject(id, userId);
            return reply.code(204).send();
        } catch (error) {
            request.log.error({ err: error }, 'Failed to delete project');
            const statusCode = error.statusCode || 500;
            return reply.code(statusCode).send({ message: error.message || 'Unable to delete project' });
        }
    }
}

module.exports = ProjectController;

