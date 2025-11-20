'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('waitlist_entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'contacted'),
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('waitlist_entries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_waitlist_entries_status";');
  }
};