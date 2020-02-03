exports.resolvers = {
    Query: {
        fullExerciseDetails: async (_, args, { req, models }) => {
            try {
                const foundExercise = await models.Exercise.findOne({ where: { id: args.id, UserId: req.session.userId } });
                if (!foundExercise) throw "Exercise not found";
                const foundSections = await models.Section.findAll({ where: { ExerciseId: foundExercise.id }, order: [["createdAt", "ASC"]] });

                let exerciseDetails = {
                    id: foundExercise.id,
                    artistName: foundExercise.artistName,
                    exerciseName: foundExercise.exerciseName,
                    createdAt: foundExercise.createdAt,
                };

                exerciseDetails["exerciseSections"] = foundSections.map(async (d) => {
                    var exerciseSection = {...d.dataValues};
                    exerciseSection["sectionBpms"] = await models.Bpm.findAll({ where: { SectionId: d.id }, order: [["createdAt", "ASC"]] });
                    return exerciseSection;
                });

                exerciseDetails["status"] = {
                    ok: true,
                };

                return exerciseDetails;
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
}
