const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
      Project.hasMany(models.ProjectUpdate, { foreignKey: 'project_id', as: 'updates' });
      Project.hasMany(models.ProjectFile, { foreignKey: 'project_id', as: 'files' });
      Project.hasOne(models.PublicPortalAccess, {
        foreignKey: 'project_id',
        as: 'portalAccess',
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'waiting', 'completed'),
        allowNull: false,
        defaultValue: 'active',
      },
      public_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      tableName: 'projects',
      modelName: 'Project',
      timestamps: false,
    }
  );

  return Project;
};

