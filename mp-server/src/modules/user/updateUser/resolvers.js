const {
    checkValidUser,
    checkValidPassword,
} = require("../conditions");
const bcrypt = require("bcrypt");
const {
    getRedisKey,
    deleteRedisKey,
} = require("../../../../utils/redisPromisified");

exports.resolvers = {
    Mutation: {
        updateUser: async (_, args, { req, models, redisClient }) => {
            try {
                const redisKey = `userVerification/${req.session.userId}`;
                const isVerified = await getRedisKey(redisClient, redisKey);
                if (!isVerified) throw "User is not verified!";

                await deleteRedisKey(redisClient, redisKey);

                let updatedEmail = false;
                let didUpdatePassword = false;
                if (args.updateEmail && args.confirmUpdateEmail) {
                    if (args.updateEmail !== args.confirmUpdateEmail) throw "Email does not match";
                    let emailExists = await checkValidUser(args.updateEmail);
                    if (emailExists) throw emailExists;
                    await models.User.update({ email: args.updateEmail }, { where: { id: req.session.userId } });
                    updatedEmail = {
                        id: req.session.userId,
                        email: args.updateEmail
                    };
                }
                if (args.performPasswordUpdate) {
                    if (args.updatePassword && args.confirmUpdatePassword) {
                        let invalidPassword = checkValidPassword({ password: args.updatePassword, password2: args.confirmUpdatePassword });
                        if (invalidPassword) throw invalidPassword;
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(args.updatePassword, salt);
                        await models.User.update({ password: hash }, { where: { id: req.session.userId } });
                        didUpdatePassword = true;
                    } else {
                        throw "Passwords Do Not Match";
                    }
                }
                if (updatedEmail) {
                    return {
                        ...updatedEmail,
                        status: {
                            ok: true,
                        }
                    }
                } else if (didUpdatePassword) {
                    return {
                        status: {
                            ok: true,
                        }
                    }
                } else {
                    throw "No operation was performed";
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