const models = require("../../../../models");

const checkExerciseOwnership = async function (req, ExerciseId) {
    const findExercise = await models.Exercise.findOne({ where: { id: ExerciseId, UserId: req.session.userId } });
    if (!findExercise) {
        return `User does not own exercise with ID: ${ExerciseId}`;
    }
    return false;
}

module.exports = {
    checkExerciseOwnership,
}