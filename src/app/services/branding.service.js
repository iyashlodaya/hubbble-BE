const { PortalBranding } = require('../../models');
const AppError = require('../utils/AppError');

class BrandingService {
  /**
   * Fetch the branding record for a given user, or null if none exists.
   */
  static async getByUserId(userId) {
    const branding = await PortalBranding.findOne({ where: { user_id: userId } });
    return branding || null;
  }

  /**
   * Validate and upsert (create or update) the branding record for a user.
   */
  static async upsert(userId, data) {
    const errors = this.validate(data);
    if (errors.length > 0) {
      const err = new AppError('Validation failed', 422);
      err.details = errors;
      throw err;
    }

    const { name, tagline, accent_color, avatar_type, avatar_value } = data;

    const payload = {
      name: name.trim(),
      tagline: tagline ? tagline.trim() : null,
      accent_color,
      avatar_type,
      avatar_value: avatar_type === 'initials' ? null : avatar_value,
    };

    const existing = await PortalBranding.findOne({ where: { user_id: userId } });

    if (existing) {
      await existing.update({ ...payload, updated_at: new Date() });
      return existing;
    }

    const branding = await PortalBranding.create({ user_id: userId, ...payload });
    return branding;
  }

  /**
   * Validate branding fields. Returns an array of { field, message } objects.
   */
  static validate(data) {
    const errors = [];

    // name — required, 1–100 chars
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (data.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Name must be at most 100 characters' });
    }

    // tagline — optional, max 255 chars
    if (data.tagline != null && typeof data.tagline === 'string' && data.tagline.length > 255) {
      errors.push({ field: 'tagline', message: 'Tagline must be at most 255 characters' });
    }

    // accent_color — required, #RRGGBB
    if (!data.accent_color || typeof data.accent_color !== 'string') {
      errors.push({ field: 'accent_color', message: 'Accent color is required' });
    } else if (!/^#[0-9A-Fa-f]{6}$/.test(data.accent_color)) {
      errors.push({ field: 'accent_color', message: 'Must be a valid hex color (#RRGGBB)' });
    }

    // avatar_type — required, one of initials | image | emoji
    const validTypes = ['initials', 'image', 'emoji'];
    if (!data.avatar_type || !validTypes.includes(data.avatar_type)) {
      errors.push({ field: 'avatar_type', message: 'Avatar type must be one of: initials, image, emoji' });
    }

    // avatar_value — required for image/emoji
    if (data.avatar_type === 'image') {
      if (!data.avatar_value || typeof data.avatar_value !== 'string' || data.avatar_value.trim().length === 0) {
        errors.push({ field: 'avatar_value', message: 'Avatar value (URL) is required when avatar type is image' });
      }
    } else if (data.avatar_type === 'emoji') {
      if (!data.avatar_value || typeof data.avatar_value !== 'string' || data.avatar_value.trim().length === 0) {
        errors.push({ field: 'avatar_value', message: 'Avatar value (emoji) is required when avatar type is emoji' });
      }
    }

    return errors;
  }
}

module.exports = BrandingService;
