
const {
    checkSongOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        removeSong: async (_, args, { req, models, userId }) => {
            try {
                const songOwnership = await checkSongOwnership(req, args.id, userId);
                if (songOwnership) {
                    throw songOwnership;
                } else {
                    const getSections = await models.Section.findAll({ where: { SongId: args.id } });
                    getSections.forEach(async (section) => await models.Bpm.destroy({ where: { SectionId: section.id } }));
                    await models.Section.destroy({ where: { SongId: args.id } });
                    await models.Song.destroy({ where: { id: args.id } });
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