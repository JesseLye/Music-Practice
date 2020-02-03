'use strict';
const bcrypt = require("bcrypt");
const uuidv4 = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("password", salt);
    return queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      email: "demo@demo.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

