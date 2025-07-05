'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Usuarios', [{
      nombre: 'Xamira',
      apellido: 'Eduardo',
      email: 'xamira.eduardo@mitiendita.com',
      password: '123456',
      rol: 'admin'
    },
    {
      nombre: 'Zera',
      apellido: 'Cortina',
      email: 'zera.cortina@mitiendita.com',
      password: '123456',
      rol: 'user'
    }
  
  
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
