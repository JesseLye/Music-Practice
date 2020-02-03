exports.resolvers = {
    Query: {
        allExerciseSections: async (_, args, { req, models }) => {
            try {
                const foundSections = await models.Section.findAll({ where: { ExerciseId: args.ExerciseId }, order: [["createdAt", "ASC"]] });
                if (!foundSections) throw "Exercise does not have any sections.";
                const sectionMap = foundSections.map((d) => {
                    return {
                        id: d.id,
                        sectionName: d.sectionName,
                        targetBPM: d.targetBPM,
                        createdAt: d.createdAt,
                        ExerciseId: d.ExerciseId,
                    }
                });
                return {
                    exerciseSection: sectionMap,
                    status: {
                        ok: true,
                    }
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
};
