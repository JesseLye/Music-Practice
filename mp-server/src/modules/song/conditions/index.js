const models = require("../../../../models");

const checkSongOwnership = async function (req, SongId) {
    const findSong = await models.Song.findOne({ where: { id: SongId, UserId: req.session.userId } });
    if (!findSong) {
        return `User does not own song with ID: ${SongId}`;
    }
    return false;
}

module.exports = {
    checkSongOwnership,
}