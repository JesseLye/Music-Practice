const isAuthenticated = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated from graphql middleware");
  }

  const foundUser = await context.models.User.findOne({ where: { id: context.req.session.userId } });

  if (!foundUser) {
    let error = "User Does Not Exist Within The Database";
    const deleteSession = () => {
      return new Promise((resolve, reject) => {
        return context.req.session.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
      })
    }
    await deleteSession();
    throw new Error(error);
  }

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
