const {
    checkSectionOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        removeSection: async (_, args, { req, models, userId }) => {
            try {
                const errors = await checkSectionOwnership(req, args.id, args.isSong, userId);
                if (errors) {
                    throw errors;
                } else {
                    await models.Bpm.destroy({ where: { SectionId: args.id } });
                    await models.Section.destroy({ where: { id: args.id } });
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