'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ItemCarritos', 'usuarioId', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ItemCarritos', 'usuarioId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
