exports.resolvers = {
  Query: {
    isAuthed: async (_, __, { req, models }) => {
      try {
        if (!req.session.userId) {
          throw "User Not Authenticated";
        }
        const foundUser = await models.User.findOne({ where: { id: req.session.userId } })
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
          throw error;
        }
        return {
          id: foundUser.id,
          email: foundUser.email,
          status: {
            ok: true,
            errMessage: null,
          }
        };
      } catch (errMessage) {
        return {
          status: {
            ok: false,
            errMessage: typeof errMessage === "string" ? errMessage : errMessage.message,
          }
        };
      }
    }
  }
};
