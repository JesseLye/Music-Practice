const {
    checkExerciseOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        updateExercise: async (_, args, { req, models, userId }) => {
            try {
                const exerciseOwnership = await checkExerciseOwnership(req, args.id, userId);
                if (exerciseOwnership) {
                    throw exerciseOwnership;
                } else {
                    var updateObject = {
                        exerciseName: args.exerciseName,
                    };
                    const updateExercise = await models.Exercise.update({ ...updateObject }, { where: { id: args.id } });
                    if (updateExercise[0] === 1) {
                        return {
                            ok: true
                        }
                    } else {
                        throw "Internal Error Updating Exercise";
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