exports.resolvers = {
    Mutation: {
        addSong: async (_, args, { req, models, userId }) => {
            try {
                const newSong = await models.Song.create({ songName: args.songName, artistName: args.artistName, UserId: userId });
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