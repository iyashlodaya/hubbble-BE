const { ProjectFile, Project, Client } = require('../../models');
const AppError = require('../utils/AppError');
const UploadService = require('./upload.service');

class ProjectFileService {
    /**
     * Validate project ownership and return the project.
     */
    static async #validateProjectOwnership(projectId, userId) {
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
        return project;
    }

    static async listFiles(projectId, userId) {
        await ProjectFileService.#validateProjectOwnership(projectId, userId);

        const files = await ProjectFile.findAll({
            where: { project_id: projectId },
            order: [['created_at', 'DESC']],
        });
        return files;
    }

    /**
     * Create a link-type file entry (existing flow, unchanged).
     */
    static async createFile(projectId, userId, data) {
        await ProjectFileService.#validateProjectOwnership(projectId, userId);

        const file = await ProjectFile.create({
            project_id: projectId,
            title: data.title,
            url: data.url,
            type: data.type,
        });
        return file;
    }

    /**
     * Upload an actual file: validate limits → upload to storage → save to DB.
     */
    static async uploadFile(projectId, userId, { buffer, filename, mimetype, title }) {
        await ProjectFileService.#validateProjectOwnership(projectId, userId);

        // 1. Validate file (size, type)
        UploadService.validateFile(buffer, mimetype, filename);

        // 2. Check user's storage quota
        const currentUsage = await UploadService.getUserStorageUsage(userId);
        if (currentUsage + buffer.length > UploadService.MAX_USER_STORAGE_BYTES) {
            const usedMB = (currentUsage / (1024 * 1024)).toFixed(1);
            const maxMB = (UploadService.MAX_USER_STORAGE_BYTES / (1024 * 1024)).toFixed(0);
            throw new AppError(
                `Storage quota exceeded. You're using ${usedMB}MB of ${maxMB}MB. Upgrade for more space.`,
                413
            );
        }

        // 3. Upload to Supabase Storage
        const { storagePath, publicUrl } = await UploadService.uploadFile(
            buffer, filename, mimetype, userId, projectId
        );

        // 4. Save to DB
        const file = await ProjectFile.create({
            project_id: projectId,
            title: title || filename,
            url: publicUrl,
            type: 'file',
            file_size: buffer.length,
            mime_type: mimetype,
            storage_path: storagePath,
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

        // If it's an uploaded file, delete from storage too
        if (file.storage_path) {
            await UploadService.deleteFile(file.storage_path);
        }

        await file.destroy();
        return;
    }
}

module.exports = ProjectFileService;
