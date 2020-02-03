
const {
    checkSongOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        updateSong: async (_, args, { req, models }) => {
            try {
                if (!args.songName && !args.artistName) {
                    throw "No arguments recieved for valid update";
                }
                const songOwnershipErrors = await checkSongOwnership(req, args.id);
                if (songOwnershipErrors) {
                    throw songOwnership;
                } else {
                    var updateObject = {};
                    if (args.songName) {
                        updateObject.songName = args.songName;
                    }
                    if (args.artistName) {
                        updateObject.artistName = args.artistName;
                    }
                    const updateSongs = await models.Song.update({ ...updateObject }, { where: { id: args.id } });
                    if (updateSongs[0] === 1) {
                        return {
                            ok: true
                        }
                    } else {
                        throw "Internal Error Updating Song";
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