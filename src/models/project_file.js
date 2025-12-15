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
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
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

