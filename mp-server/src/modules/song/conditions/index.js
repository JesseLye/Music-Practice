const models = require("../../../../models");

const checkSongOwnership = async function (req, songId, userId) {
    const findSong = await models.Song.findOne({ where: { id: songId, UserId: userId } });
    if (!findSong) {
        return `User does not own song with ID: ${songId}`;
    }
    return false;
}

module.exports = {
    checkSongOwnership,
}