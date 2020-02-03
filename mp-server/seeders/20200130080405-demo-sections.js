'use strict';
const models = require("../models");
const uuidv4 = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const foundSong = await models.Song.findOne({ where: { songName: "Little Wing" } });
    const foundExercise = await models.Exercise.findOne({ where: { exerciseName: "Scales" }});
    return queryInterface.bulkInsert('Sections', [{
      id: uuidv4(), 
      sectionName: "Verse",
      targetBPM: 120,
      SongId: foundSong.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(), 
      sectionName: "Chorus",
      targetBPM: 120,
      SongId: foundSong.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(), 
      sectionName: "Verse",
      targetBPM: 120,
      SongId: foundSong.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      sectionName: "Major Scale Quarter Notes",
      targetBPM: 160,
      ExerciseId: foundExercise.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      sectionName: "Blues Scale Quarter Notes",
      targetBPM: 160,
      ExerciseId: foundExercise.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: uuidv4(),
      sectionName: "Pentatonic Scale",
      targetBPM: 160,
      ExerciseId: foundExercise.id ,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sections', null, {});
  }
};