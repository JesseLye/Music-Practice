exports.resolvers = {
    Mutation: {
        logoutUser: async (_, __, { req }) => {
            try {
                // Client will clear out the JWT
                return {
                    ok: true,
                };
            } catch (errMessage) {
                return {
                    ok: false,
                    errMessage: typeof errMessage === "string" ? errMessage : errMessage.message,
                };
            }
        }
    }
}