exports.resolvers = {
    Mutation: {
        addSong: async (_, args, { req, models }) => {
            try {
                const newSong = await models.Song.create({ songName: args.songName, artistName: args.artistName, UserId: req.session.userId });
                return {
                    id: newSong.id,
                    songName: newSong.songName,
                    artistName: newSong.artistName,
                    status: {
                        ok: true,
                    },
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
}