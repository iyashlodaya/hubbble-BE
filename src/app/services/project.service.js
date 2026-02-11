const { Project, Client } = require('../../models');
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
        const whereClient = userId ? { user_id: userId } : undefined;
        const clients = await Client.findAll({ where: whereClient });
        const clientIds = clients.map((client) => client.id);
        const projects = await Project.findAll({
            where: { client_id: clientIds },
            order: [['created_at', 'DESC']],
            include: [{
                model: Client,
                attributes: ['name', 'id'],
                as: 'client' // Alias the included model for clarity
            }],
        });
        return projects;
    }

    static async getProjectById(id, userId) {
        const { User } = require('../../models');

        const project = await Project.findOne({
            where: { id },
            include: [{
                model: Client,
                as: 'client',
                // If userId is provided, filter by it (ownership check)
                where: userId ? { user_id: userId } : undefined,
                required: true,
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'avatar_url', 'accent_color'],
                }]
            }]
        });

        if (!project) {
            throw new AppError('Project not found or unauthorized', 404);
        }

        // Transform response to flatten freelancer object
        // Project -> Client -> User -> Freelancer fields
        const projectData = project.toJSON();
        
        if (projectData.client && projectData.client.user) {
            projectData.freelancer = projectData.client.user;
            // Clean up nested structures if desired, but keeping client/user attached is also fine.
            // Requirement says "Include a nested 'freelancer' object in response"
            // We can optionally remove projectData.client.user if we want to avoid duplication
            delete projectData.client.user; 
        }

        return projectData;
    }

    static async updateProject(id, userId, data) {
        const project = await this.getProjectById(id, userId);
        
        // Exclude fields that shouldn't be updated directly via this method
        const { id: _, client_id: __, public_slug: ___, ...updateData } = data;
        
        await project.update(updateData);
        return project;
    }

    static async deleteProject(id, userId) {
        const project = await this.getProjectById(id, userId);
        await project.destroy();
        return;
    }
}

module.exports = ProjectService;

