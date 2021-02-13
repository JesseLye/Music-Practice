const { decodeUserIdFromJwtAuthorizationHeader } = require('./src/authentication');

const isAuthenticated = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  const userId = decodeUserIdFromJwtAuthorizationHeader(context.req.headers);
  const foundUser = await context.models.User.findOne({ where: { id: userId } });
  if (!foundUser) {
    throw new Error(error);
  }
  // set JWT to be available throughout each request that requires "isAuthenticated"
  context.userId = userId;
  return resolve(parent, args, context, info);
};

module.exports = middleware = {
  Mutation: {
    updateUser: isAuthenticated,
    logoutUser: isAuthenticated,
    removeUser: isAuthenticated,
    addSong: isAuthenticated,
    updateSong: isAuthenticated,
    removeSong: isAuthenticated,
    addExercise: isAuthenticated,
    updateExercise: isAuthenticated,
    removeExercise: isAuthenticated,
    addSections: isAuthenticated,
    updateSection: isAuthenticated,
    removeSection: isAuthenticated,
    addBpm: isAuthenticated,
    removeBpm: isAuthenticated,
  },
  Query: {
    allUserSongs: isAuthenticated,
    allUserExercises: isAuthenticated,
    allExerciseSections: isAuthenticated,
    allSongSections: isAuthenticated,
    fullSongDetails: isAuthenticated,
    fullExerciseDetails: isAuthenticated,
    allSectionBpms: isAuthenticated,
  }
};
