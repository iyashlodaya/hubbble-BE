'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('project_files', 'file_size', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn('project_files', 'mime_type', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('project_files', 'storage_path', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('project_files', 'storage_path');
    await queryInterface.removeColumn('project_files', 'mime_type');
    await queryInterface.removeColumn('project_files', 'file_size');
  },
};
