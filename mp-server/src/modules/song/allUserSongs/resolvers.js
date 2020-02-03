exports.resolvers = {
    Query: {
        allUserSongs: async (_, __, { req, models }) => {
            try {
                const foundSongs = await models.Song.findAll({ where: { UserId: req.session.userId }, order: [["createdAt", "ASC"]] });
                if (foundSongs.length === 0) throw "User does not have any songs.";
                var buildSongs = foundSongs.map(async (d) => {
                    const foundSections = await models.Section.findAll({ where: { SongId: d.id }, order: [["createdAt", "ASC"]] });
                    var buildSections = foundSections.map((d) => {
                        return {
                            id: d.id,
                            sectionName: d.sectionName,
                            targetBPM: d.targetBPM,
                            createdAt: d.createdAt,
                            SongId: d.SongId,
                        }
                    });
                    return {
                        id: d.id,
                        songName: d.songName,
                        artistName: d.artistName,
                        createdAt: d.createdAt,
                        songSections: [...buildSections],
                    }
                });
                return {
                    songs: buildSongs,
                    status: {
                        ok: true,
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
