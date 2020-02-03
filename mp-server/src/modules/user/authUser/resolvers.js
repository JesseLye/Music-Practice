const {
    comparePassword,
} = require("../conditions");
const {
    setRedisKey
} = require("../../../../utils/redisPromisified");


exports.resolvers = {
    Mutation: {
        authUser: async (_, args, { req, models, redisClient }) => {
            try {
                const findUser = await models.User.findOne({ where: { email: args.email } });
                if (!findUser) {
                    throw "Email Address Not Found";
                }
                const invalidPassword = await comparePassword(findUser.password, args.password);
                    if (!invalidPassword) {
                        if (args.setNewSession) {
                            req.session.userId = findUser.id;
                        } else {
                            await setRedisKey(redisClient, "userVerification", findUser.id, findUser.id);
                        }
                        return {
                            id: findUser.id,
                            email: findUser.email,
                            status: {
                                ok: true,
                            }
                        };
                    } else {
                        throw invalidPassword;
                    }
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
}