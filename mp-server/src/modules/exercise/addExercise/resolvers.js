exports.resolvers = {
    Mutation: {
        addExercise: async (_, args, { req, models, userId }) => {
            try {
                const newExercise = await models.Exercise.create({ exerciseName: args.exerciseName, UserId: userId });
                return {
                    id: newExercise.id,
                    exerciseName: newExercise.exerciseName,
                    status: {
                        ok: true,
                    },
                }
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