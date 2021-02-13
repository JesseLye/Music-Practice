const models = require("../../../../models");

const checkExerciseOwnership = async function (req, exerciseId, userId) {
    const findExercise = await models.Exercise.findOne({ where: { id: exerciseId, UserId: userId } });
    if (!findExercise) {
        return `User does not own exercise with ID: ${exerciseId}`;
    }
    return false;
}

module.exports = {
    checkExerciseOwnership,
}