const { Project, ProjectUpdate, ProjectFile, Client } = require('../../models');
const AppError = require('../utils/AppError');

class PublicPortalService {
    static async getPublicPortal(slug) {
        const { User } = require('../../models');

        const project = await Project.findOne({
            where: { public_slug: slug },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['full_name', 'avatar_url', 'accent_color'],
                    }]
                },
                {
                    model: ProjectUpdate,
                    as: 'updates',
                },
                {
                    model: ProjectFile,
                    as: 'files',
                },
            ],
            order: [
                [{ model: ProjectUpdate, as: 'updates' }, 'created_at', 'DESC'],
                [{ model: ProjectFile, as: 'files' }, 'created_at', 'DESC'],
            ],
        });

        if (!project) {
            throw new AppError('Public portal not found', 404);
        }

        // Transform response: flatten freelancer details
        const projectData = project.toJSON();
        const response = {
            project: {
                id: projectData.id,
                name: projectData.name,
                description: projectData.description,
                status: projectData.status,
                client: {
                    name: projectData.client.name,
                    id: projectData.client.id
                }
            },
            updates: projectData.updates,
            files: projectData.files,
            freelancer: projectData.client?.user || null
        };
        
        return response;
    }
}

module.exports = PublicPortalService;
