const {
    getRedisKey
} = require("../../../../utils/redisPromisified");

exports.resolvers = {
    Query: {
        checkResetPassword: async (_, args, { redisClient }) => {
            try {
                const redisKey = `forgotPassword/${args.key}`;
                const hasID = await getRedisKey(redisClient, redisKey);
                if (!hasID) throw "ID Not Found";
                return {
                    ok: true,
                }
            } catch (errMessage) {
                return {
                    ok: false,
                    errMessage: typeof errMessage === "string" ? errMessage : errMessage.message,
                }
            }
        }
    }
}
