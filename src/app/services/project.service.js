const { Project } = require('../../models');
const AppError = require('../utils/AppError');

class ProjectService {
    static async createProject(client_id, project_name, description, project_status) {
        if (!project_name || !description || !project_status || !client_id) {
            throw new AppError('Missing required fields', 400);
        }

        // Generate simple slug
        const slug = project_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now().toString(36);

        const project = await Project.create({
            client_id,
            name: project_name,
            description,
            status: project_status,
            public_slug: slug,
        });
        return project;
    }

    static async listProjects(userId) {
        const where = userId ? { user_id: userId } : undefined;
        const projects = await Project.findAll({
            where,
            order: [['created_at', 'DESC']],
        });
        return projects;
    }

    static async getProjectById(id, userId) {
        const where = { id };
        if (userId) {
            where.user_id = userId;
        }

        const project = await Project.findOne({ where });
        if (!project) {
            throw new AppError('Project not found', 404);
        }
        return project;
    }

    static async deleteProject(id, userId) {
        const project = await this.getProjectById(id, userId);
        await project.destroy();
        return;
    }
}

module.exports = ProjectService;

