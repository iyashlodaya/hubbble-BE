const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectUpdate extends Model {
    static associate(models) {
      ProjectUpdate.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }

  ProjectUpdate.init(
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
      content: {
        type: DataTypes.TEXT,
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
      tableName: 'project_updates',
      modelName: 'ProjectUpdate',
      timestamps: false,
    }
  );

  return ProjectUpdate;
};

