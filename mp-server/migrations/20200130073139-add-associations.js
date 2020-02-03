'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Songs",
      "UserId",
      {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    )
      .then(() => {
        return queryInterface.addColumn(
          "Exercises",
          "UserId",
          {
            type: Sequelize.UUID,
            references: {
              model: "Users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        )
      })
      .then(() => {
        return queryInterface.addColumn(
          "Sections",
          "SongId",
          {
            type: Sequelize.UUID,
            references: {
              model: "Songs",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        )
      })
      .then(() => {
        return queryInterface.addColumn(
          "Sections",
          "ExerciseId",
          {
            type: Sequelize.UUID,
            references: {
              model: "Exercises",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        )
      })
      .then(() => {
        return queryInterface.addColumn(
          "Bpms",
          "SectionId",
          {
            type: Sequelize.UUID,
            references: {
              model: "Sections",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Songs",
      "UserId",
    )
      .then(() => {
        return queryInterface.removeColumn(
          "Exercises",
          "UserId",
        )
      })
      .then(() => {
        return queryInterface.removeColumn(
          "Sections",
          "SongId",
        )
      })
      .then(() => {
        return queryInterface.removeColumn(
          "Sections",
          "ExerciseId",
        )
      })
      .then(() => {
        return queryInterface.removeColumn(
          "Bpms",
          "SectionId",
        )
      })
  }
};
