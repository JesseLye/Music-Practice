const { checkSectionOwnership } = require("../../section/conditions");

exports.resolvers = {
    Mutation: {
        addBpm: async (_, args, { req, models, userId }) => {
            try {
                const validationErrors = await checkSectionOwnership(req, args.id, !!args.isSong, userId);
                if (validationErrors) {
                    throw validationErrors;
                } else {
                    const newBpm = await models.Bpm.create({ bpm: args.bpm, SectionId: args.id });
                    return {
                        id: newBpm.id,
                        bpm: newBpm.bpm,
                        targetBpm: newBpm.targetBpm,
                        createdAt: newBpm.createdAt,
                        status: {
                            ok: true,
                        }
                    };
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