const { supabase } = require('../../lib/supabase');
const { ProjectFile, Project, Client } = require('../../models');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const path = require('path');

// ── Configurable limits (easy to raise for paid tiers) ──────────────────────
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per upload
const MAX_USER_STORAGE_BYTES = 50 * 1024 * 1024; // 50 MB total per user
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'project-files';

const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/gzip',
  // Text
  'text/plain',
  'text/csv',
];

class UploadService {
  /**
   * Get total storage used by a user across all their projects.
   */
  static async getUserStorageUsage(userId) {
    const { sequelize } = require('../../models');
    const [results] = await sequelize.query(
      `SELECT COALESCE(SUM(pf.file_size), 0) AS total_bytes
       FROM project_files pf
       JOIN projects p ON pf.project_id = p.id
       JOIN clients c ON p.client_id = c.id
       WHERE c.user_id = :userId AND pf.type = 'file'`,
      { replacements: { userId } }
    );
    return parseInt(results[0].total_bytes, 10);
  }

  /**
   * Validate file before upload.
   */
  static validateFile(buffer, mimetype, filename) {
    if (!buffer || buffer.length === 0) {
      throw new AppError('No file provided', 400);
    }

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new AppError(
        `File exceeds ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit`,
        413
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
      throw new AppError(
        `File type "${mimetype}" not allowed. Allowed types: images, PDFs, documents, archives, text files.`,
        400
      );
    }
  }

  /**
   * Upload a file to Supabase Storage.
   * Returns { storagePath, publicUrl }
   */
  static async uploadFile(buffer, originalFilename, mimetype, userId, projectId) {
    if (!supabase) {
      throw new AppError('Storage service not configured. Please set SUPABASE_URL and SUPABASE_KEY.', 503);
    }

    // Generate unique filename to avoid collisions
    const ext = path.extname(originalFilename);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeBasename = path.basename(originalFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const storagePath = `user_${userId}/project_${projectId}/${uniqueId}_${safeBasename}${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (error) {
      throw new AppError(`Storage upload failed: ${error.message}`, 500);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: urlData.publicUrl,
    };
  }

  /**
   * Delete a file from Supabase Storage.
   */
  static async deleteFile(storagePath) {
    if (!supabase || !storagePath) return;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      // Log but don't throw — DB record deletion should still succeed
      console.error(`Failed to delete file from storage: ${error.message}`);
    }
  }
}

// Export constants for use in other modules
UploadService.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
UploadService.MAX_USER_STORAGE_BYTES = MAX_USER_STORAGE_BYTES;
UploadService.ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES;

module.exports = UploadService;
