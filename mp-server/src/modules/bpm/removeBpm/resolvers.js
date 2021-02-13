const { checkSectionOwnership } = require("../../section/conditions");

exports.resolvers = {
    Mutation: {
        removeBpm: async (_, args, { req, models, userId }) => {
            try {
                const validationErrors = await checkSectionOwnership(req, args.sectionId, !!args.isSong, userId);
                if (validationErrors) {
                    throw validationErrors;
                } else {
                    for (let i = 0; i < args.bpms.length; i++) {
                        await models.Bpm.destroy({ where: { id: args.bpms[i].bpmId } });
                    }
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