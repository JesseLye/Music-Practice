'use strict';
const models = require("../models");
const uuidv4 = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const foundUser = await models.User.findOne({ where: { email: "demo@demo.com" } });
    return queryInterface.bulkInsert('Songs', [{
      id: uuidv4(), 
      artistName: "Jimi Hendrix",
      songName: "Little Wing",
      UserId: foundUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Songs', null, {});
  }
};