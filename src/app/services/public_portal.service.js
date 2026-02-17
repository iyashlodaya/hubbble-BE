const { Project, ProjectUpdate, ProjectFile, Client } = require('../../models');
const AppError = require('../utils/AppError');

class PublicPortalService {
    static async getPublicPortal(slug) {
        const { User, PortalBranding } = require('../../models');

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
                        attributes: ['id', 'full_name', 'avatar_url', 'accent_color'],
                        include: [{
                            model: PortalBranding,
                            as: 'branding',
                            attributes: ['name', 'tagline', 'accent_color', 'avatar_type', 'avatar_value'],
                        }],
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
        const user = projectData.client?.user || null;
        const branding = user?.branding || null;

        // Build freelancer object: prefer branding data, fall back to user data
        const freelancer = user
            ? {
                id: user.id,
                full_name: branding?.name || user.full_name,
                avatar_url: user.avatar_url,
                accent_color: branding?.accent_color || user.accent_color || null,
                tagline: branding?.tagline || null,
                avatar_type: branding?.avatar_type || null,
                avatar_value: branding?.avatar_value || null,
            }
            : null;

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
            freelancer,
        };
        
        return response;
    }
}

module.exports = PublicPortalService;

