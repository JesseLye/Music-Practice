const buildSongSection = function(args, index) {
    return {
        ...args.input[index],
        SongId: args.SongId,
    };
}

const buildExerciseSection = function(args, index) {
    return {
        ...args.input[index],
        ExerciseId: args.ExerciseId,
    };
}

module.exports = {
    buildSongSection,
    buildExerciseSection,
};