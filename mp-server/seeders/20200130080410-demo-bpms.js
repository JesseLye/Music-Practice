'use strict';
const models = require("../models");
const moment = require("moment");
const uuidv4 = require('uuid/v4');

function insertBpm(sectionIds, startDate, duration) {
  let bpmArray = [];
  for (let i = 0; i < sectionIds.length; i++) {
    let minBpm = 50;
    let maxBpm = 60;
    for (let j = 1; j <= duration; j++) {
      let insertAmount = Math.round((Math.random() * (0 - 12) + 12))
      let incrementer = 0;
      while (incrementer !== insertAmount) {
        let currentDate = moment(startDate).add(j, "days").toDate();
        bpmArray.push({
          id: uuidv4(), 
          bpm: Math.round((Math.random() * (minBpm - maxBpm) + minBpm)),
          SectionId: sectionIds[i],
          createdAt: currentDate,
          updatedAt: currentDate
        });
        incrementer++;
      }
      minBpm += 2;
      maxBpm += 2;
    }
  }
  return bpmArray;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const foundSong = await models.Song.findOne({ where: { songName: "Little Wing" } });
    const foundSongSection = await models.Section.findAll({ where: { SongId: foundSong.id }});
    const songSectionIds = foundSongSection.map(d => d.id);

    const foundExercise = await models.Exercise.findOne({ where: { exerciseName: "Scales" }});
    const foundExerciseSection = await models.Section.findAll({ where: { ExerciseId: foundExercise.id }});
    const exerciseSectionIds = foundExerciseSection.map(d => d.id);

    let insertArray = [];
    const duration = 120;
    const startDate = moment().subtract(duration, "days").toDate();

    let songBpms = insertBpm(songSectionIds, startDate, duration);
    let exerciseBpms = insertBpm(exerciseSectionIds, startDate, duration);

    insertArray = songBpms.concat(exerciseBpms);

    return queryInterface.bulkInsert('Bpms', [...insertArray], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Bpms", null, {});
  }
};