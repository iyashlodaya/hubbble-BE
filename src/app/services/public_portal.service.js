const { Project, ProjectUpdate, ProjectFile } = require('../../models');
const AppError = require('../utils/AppError');

class PublicPortalService {
    static async getPublicPortal(slug) {
        const project = await Project.findOne({
            where: { public_slug: slug },
            include: [
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

        return project;
    }
}

module.exports = PublicPortalService;
