exports.resolvers = {
    Query: {
        fullSongDetails: async (_, args, { req, models, userId }) => {
            try {
                const foundSong = await models.Song.findOne({ where: { id: args.id, UserId: userId } });
                if (!foundSong) throw "Song not found";
                const foundSections = await models.Section.findAll({ where: { SongId: foundSong.id }, order: [["createdAt", "ASC"]] });

                let songDetails = {
                    id: foundSong.id,
                    artistName: foundSong.artistName,
                    songName: foundSong.songName,
                    createdAt: foundSong.createdAt,
                };

                songDetails["songSections"] = foundSections.map(async (d) => {
                    var songSection = {...d.dataValues};
                    songSection["sectionBpms"] = await models.Bpm.findAll({ where: { SectionId: d.id }, order: [["createdAt", "ASC"]] });
                    return songSection;
                });

                songDetails["status"] = {
                    ok: true,
                };

                return songDetails;
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
