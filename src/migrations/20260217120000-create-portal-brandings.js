'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('portal_brandings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tagline: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      accent_color: {
        type: Sequelize.STRING(7),
        allowNull: false,
        defaultValue: '#00A8E8',
      },
      avatar_type: {
        type: Sequelize.ENUM('initials', 'image', 'emoji'),
        allowNull: false,
        defaultValue: 'initials',
      },
      avatar_value: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('portal_brandings');
  },
};
