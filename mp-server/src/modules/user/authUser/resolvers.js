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
                const foundUser = await models.User.findOne({ where: { email: args.email } });
                if (!foundUser) {
                    throw "Email Address Not Found";
                }
                const invalidPassword = await comparePassword(foundUser.password, args.password);
                if (!invalidPassword) {
                    if (args.setNewToken) {
                        const token = jwt.sign({
                            id: foundUser.id,
                        },
                            process.env.SECRET_KEY
                        );
                        return {
                            id: foundUser.id,
                            email: foundUser.email,
                            token,
                            status: {
                                ok: true,
                            }
                        };
                    } else {
                        await setRedisKey(redisClient, "userVerification", foundUser.id, foundUser.id);
                        return {
                            id: foundUser.id,
                            email: foundUser.email,
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