const {
    checkSectionOwnership
} = require("../conditions");

exports.resolvers = {
    Mutation: {
        updateSection: async (_, args, { req, models }) => {
            try {
                const argsLength = Object.keys(args).length;
                if (argsLength === 2) {
                    throw "Another argument besides id is required";
                }
                const error = await checkSectionOwnership(req, args.id, args.isSong);
                if (error) {
                    throw error;
                } else {
                    let updateArgs = { ...args };
                    delete updateArgs.id;
                    await models.Section.update(updateArgs, { where: { id: args.id } });
                    return {
                        ok: true,
                    }
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