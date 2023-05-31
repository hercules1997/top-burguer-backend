"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Categories", "path", {
      type: Sequelize.STRING,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Categories", "path")
  },
}
