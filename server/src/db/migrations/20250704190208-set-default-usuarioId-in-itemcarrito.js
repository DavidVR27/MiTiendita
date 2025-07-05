'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'UPDATE "ItemCarritos" SET "usuarioId" = 0 WHERE "usuarioId" IS NULL;'
    );
  },

  async down(queryInterface, Sequelize) {
    // This down migration might not be easily reversible if you don't know the original null values.
    // For simplicity, we'll leave it empty or add a warning.
  }
};
