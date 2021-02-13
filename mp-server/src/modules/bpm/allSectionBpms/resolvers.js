const { checkSectionOwnership } = require("../../section/conditions");

exports.resolvers = {
    Query: {
        allSectionBpms: async (_, args, { req, models, userId }) => {
            try {
                await checkSectionOwnership(req, args.SectionId, !!args.isSong, userId);
                const foundSectionBpms = await models.Bpm.findAll({ where: { SectionId: args.SectionId }, order: [["createdAt", "ASC"]] });
                const mapBpms = foundSectionBpms.map((d) => {
                    return {
                        id: d.id,
                        bpm: d.bpm,
                        createdAt: d.createdAt,
                    }
                });
                return {
                    bpms: mapBpms,
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
