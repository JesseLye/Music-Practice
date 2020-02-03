exports.resolvers = {
    Query: {
        allSongSections: async (_, args, { req, models }) => {
            try {
                const foundSections = await models.Section.findAll({ where: { SongId: args.SongId }, order: [["createdAt", "ASC"]] });
                if (!foundSections) throw "Song does not have any sections.";
                const sectionMap = foundSections.map((d) => {
                    return {
                        id: d.id,
                        sectionName: d.sectionName,
                        targetBPM: d.targetBPM,
                        createdAt: d.createdAt,
                        SongId: d.SongId,
                    }
                });
                return {
                    songSections: sectionMap,
                    status: {
                        ok: false,
                    }
                };
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
