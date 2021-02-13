const { decodeUserIdFromJwtAuthorizationHeader } = require('../../../authentication');

exports.resolvers = {
  Query: {
    isAuthed: async (_, __, { req, models }) => {
      try {
        var userId = decodeUserIdFromJwtAuthorizationHeader(req.headers);
        const foundUser = await models.User.findOne({ where: { id: userId } });
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
