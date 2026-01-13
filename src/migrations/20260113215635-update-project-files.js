'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('project_files', 'file_url', 'url');
    await queryInterface.addColumn('project_files', 'type', {
      type: Sequelize.ENUM('link', 'file'),
      allowNull: false,
      defaultValue: 'file',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project_files', 'type');
    await queryInterface.renameColumn('project_files', 'url', 'file_url');
    // Note: To truly undo ENUM, you might need to drop the type if using Postgres
  },
};
