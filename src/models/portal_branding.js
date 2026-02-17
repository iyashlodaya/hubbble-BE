const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PortalBranding extends Model {
    static associate(models) {
      PortalBranding.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  PortalBranding.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      tagline: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      accent_color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#00A8E8',
      },
      avatar_type: {
        type: DataTypes.ENUM('initials', 'image', 'emoji'),
        allowNull: false,
        defaultValue: 'initials',
      },
      avatar_value: {
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
      tableName: 'portal_brandings',
      modelName: 'PortalBranding',
      timestamps: false,
    }
  );

  return PortalBranding;
};
