const {
    checkExerciseOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        removeExercise: async (_, args, { req, models, userId }) => {
            try {
                const exerciseOwnership = await checkExerciseOwnership(req, args.id, userId);
                if (exerciseOwnership) {
                    throw exerciseOwnership;
                } else {
                    const getSections = await models.Section.findAll({ where: { ExerciseId: args.id }, order: [["createdAt", "ASC"]] });

                    getSections.forEach(async (section) => await models.Bpm.destroy({ where: { SectionId: section.id } }));
                    await models.Section.destroy({ where: { ExerciseId: args.id } });
                    await models.Exercise.destroy({ where: { id: args.id } });
                    return {
                        ok: true,
                    }
                }
            } catch (errMessage) {
                return {
                    ok: false,
                    errMessage: typeof errMessage === "string" ? errMessage : errMessage.message,
                };
            }
        }
    }
}