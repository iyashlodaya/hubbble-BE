const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PublicPortalAccess extends Model {
    static associate(models) {
      PublicPortalAccess.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
      });
    }
  }

  PublicPortalAccess.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      last_accessed_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      access_count: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'public_portal_access',
      modelName: 'PublicPortalAccess',
      timestamps: false,
    }
  );

  return PublicPortalAccess;
};

