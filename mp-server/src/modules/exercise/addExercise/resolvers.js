exports.resolvers = {
    Mutation: {
        addExercise: async (_, args, { req, models }) => {
            try {
                const newExercise = await models.Exercise.create({ exerciseName: args.exerciseName, UserId: req.session.userId });
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