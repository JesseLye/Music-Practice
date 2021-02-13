
const {
    checkValidPassword,
} = require("../conditions");
const bcrypt = require("bcrypt");
const {
    getRedisKey,
    deleteRedisKey,
} = require("../../../../utils/redisPromisified");

exports.resolvers = {
    Mutation: {
        performResetPassword: async (_, args, { models, redisClient }) => {
            try {
                const { newPassword1, newPassword2, key } = args;
                let invalidPassword = checkValidPassword({ password: newPassword1, password2: newPassword2 });
                if (invalidPassword) throw invalidPassword;
                const redisKey = `forgotPassword/${key}`;

                const userID = await getRedisKey(redisClient, redisKey);
                if (!userID) throw "ID could not be found";

                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword1, salt);
                await models.User.update({ password: hash }, { where: { id: userID } });

                await deleteRedisKey(redisClient, redisKey);
                return {
                    ok: true,
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