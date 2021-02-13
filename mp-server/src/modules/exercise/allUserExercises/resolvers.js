exports.resolvers = {
    Query: {
        allUserExercises: async (_, __, { req, models, userId }) => {
            try {
                const foundExercises = await models.Exercise.findAll({ where: { UserId: userId }, order: [["createdAt", "ASC"]] });
                if (foundExercises.length === 0) throw "User does not have any exercises.";
                var buildExercises = foundExercises.map(async (d) => {
                    const foundSections = await models.Section.findAll({ where: { ExerciseId: d.id }, order: [["createdAt", "ASC"]] });
                    var buildSections = foundSections.map((d) => {
                        return {
                            id: d.id,
                            sectionName: d.sectionName,
                            targetBPM: d.targetBPM,
                            ExerciseId: d.ExerciseId,
                        }
                    });
                    return {
                        id: d.id,
                        exerciseName: d.exerciseName,
                        createdAt: d.createdAt,
                        exerciseSections: [...buildSections],
                    }
                });
                return {
                    exercises: buildExercises,
                    status: {
                        ok: true,
                    }
                };
            } catch (errMessage) {
                return {
                    status: {
                        ok: false,
                        errMessage: typeof errMessage === "string" ? errMessage : errMessage.message,
                    }
                };
            }
        }
    }
};
