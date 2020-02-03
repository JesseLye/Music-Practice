exports.resolvers = {
    Mutation: {
        removeUser: async (_, __, { req, models }) => {
            try {
                const foundUser = await models.User.findOne({ where: { id: req.session.userId } });
                const getAllSongs = await models.Song.findAll({ where: { UserId: foundUser.id } });
                const getAllExercises = await models.Exercise.findAll({ where: { UserId: foundUser.id } });

                for (let i = 0; i < getAllSongs.length; i++) {
                    const getSections = await models.Section.findAll({ where: { SongId: getAllSongs[i].id } });
                    getSections.forEach(async (section) => await models.Bpm.destroy({ where: { SectionId: section.id } }));
                    await models.Section.destroy({ where: { SongId: getAllSongs[i].id } });
                    await models.Song.destroy({ where: { id: getAllSongs[i].id } });
                }

                for (let i = 0; i < getAllExercises.length; i++) {
                    const getSections = await models.Section.findAll({ where: { ExerciseId: getAllExercises[i].id } });
                    getSections.forEach(async (section) => await models.Bpm.destroy({ where: { SectionId: section.id } }));
                    await models.Section.destroy({ where: { ExerciseId: getAllExercises[i].id } });
                    await models.Exercise.destroy({ where: { id: getAllExercises[i].id } });
                }

                await models.User.destroy({ where: { id: req.session.userId } });
                const deleteSession = () => {
                    return new Promise((resolve, reject) => {
                        return req.session.destroy((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    })
                }
                await deleteSession();
                return {
                    ok: true
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