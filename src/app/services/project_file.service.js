const { ProjectFile, Project, Client } = require('../../models');
const AppError = require('../utils/AppError');

class ProjectFileService {
    static async listFiles(projectId, userId) {
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

        const files = await ProjectFile.findAll({
            where: { project_id: projectId },
            order: [['created_at', 'DESC']],
        });
        return files;
    }

    static async createFile(projectId, userId, data) {
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

        const file = await ProjectFile.create({
            project_id: projectId,
            title: data.title,
            url: data.url,
            type: data.type,
        });
        return file;
    }

    static async deleteFile(id, userId) {
        const file = await ProjectFile.findByPk(id, {
            include: [{
                model: Project,
                as: 'project',
                include: [{
                    model: Client,
                    as: 'client',
                    where: userId ? { user_id: userId } : undefined,
                    required: true
                }]
            }]
        });

        if (!file || !file.project) {
            throw new AppError('File not found or unauthorized', 404);
        }

        await file.destroy();
        return;
    }
}

module.exports = ProjectFileService;
