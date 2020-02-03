const { checkSongOwnership } = require("../../song/conditions");
const { checkExerciseOwnership } = require("../../exercise/conditions");

const models = require("../../../../models");

const findSectionCheck = async function (req, id, isSong) {
    if (!id) return "Either a SongId or ExerciseId is required";
    if (isSong) {
        const findSong = await models.Song.findOne({ where: { id, UserId: req.session.userId } });
        if (!findSong) return "Song not found";
    } else {
        const findExercise = await models.Exercise.findOne({ where: { id, UserId: req.session.userId } });
        if (!findExercise) return "Exercise not found";
    }
    return false;
}

const checkSectionOwnership = async function (req, SectionId, isSong) {
    const findSection = await models.Section.findOne({ where: { id: SectionId } });
    if (!findSection) {
        let whichSection = isSong ? "Song" : "Exercise";
        return `${whichSection} does not have section with ID: ${SectionId}`;
    }
    if (isSong) {
        const songOwnershipError = await checkSongOwnership(req, findSection.SongId);
        if (songOwnershipError) {
            return songOwnershipError;
        }
    } else {
        const exerciseOwnershipError = await checkExerciseOwnership(req, findSection.ExerciseId);
        if (exerciseOwnershipError) {
            return exerciseOwnershipError;
        }
    }
    return false;
}

module.exports = {
    findSectionCheck,
    checkSectionOwnership,
}