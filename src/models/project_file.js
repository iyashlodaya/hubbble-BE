const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectFile extends Model {
    static associate(models) {
      ProjectFile.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }

  ProjectFile.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('link', 'file'),
        allowNull: false,
        defaultValue: 'file',
      },
      file_size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      mime_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      storage_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
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
      tableName: 'project_files',
      modelName: 'ProjectFile',
      timestamps: false,
    }
  );

  return ProjectFile;
};

