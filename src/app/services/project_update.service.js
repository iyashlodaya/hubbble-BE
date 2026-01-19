const { ProjectUpdate, Project, Client } = require('../../models');
const AppError = require('../utils/AppError');

class ProjectUpdateService {
    static async listUpdates(projectId, userId) {
        // Validate project ownership
        const project = await Project.findOne({
            where: { id: projectId },
            include: [{
                model: Client,
                as: 'client',
                where: userId ? { user_id: userId } : undefined,
                required: true
            }]
        });

        if (!project) {
            throw new AppError('Project not found or unauthorized', 404);
        }

        const updates = await ProjectUpdate.findAll({
            where: { project_id: projectId },
            order: [['created_at', 'DESC']],
        });
        return updates;
    }

    static async createUpdate(projectId, userId, data) {
        // Validate project ownership
        const project = await Project.findOne({
            where: { id: projectId },
            include: [{
                model: Client,
                as: 'client',
                where: userId ? { user_id: userId } : undefined,
                required: true
            }]
        });

        if (!project) {
            throw new AppError('Project not found or unauthorized', 404);
        }

        const update = await ProjectUpdate.create({
            project_id: projectId,
            title: data.title,
            content: data.content,
        });
        return update;
    }

    static async deleteUpdate(projectId, updateId, userId) {
        const update = await ProjectUpdate.findOne({
            where: {id: updateId, project_id: projectId}
        });


        if (!update || update.dataValues.project_id !== projectId) {
            throw new AppError('Update not found or unauthorized', 404);
        }

        await update.destroy();
        return update;
    }
}

module.exports = ProjectUpdateService;
