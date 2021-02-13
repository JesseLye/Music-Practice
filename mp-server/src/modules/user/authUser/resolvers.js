const {
    comparePassword,
} = require("../conditions");
const {
    setRedisKey
} = require("../../../../utils/redisPromisified");
const jwt = require("jsonwebtoken");

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
                    if (args.setNewToken) {
                        const token = jwt.sign({
                            id: newUser.id,
                        },
                            process.env.SECRET_KEY
                        );
                        return {
                            id: findUser.id,
                            email: findUser.email,
                            token,
                            status: {
                                ok: true,
                            }
                        };
                    } else {
                        await setRedisKey(redisClient, "userVerification", findUser.id, findUser.id);
                        return {
                            id: findUser.id,
                            email: findUser.email,
                            status: {
                                ok: true,
                            }
                        };
                    }
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