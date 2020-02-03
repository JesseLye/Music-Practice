exports.resolvers = {
    Mutation: {
        logoutUser: async (_, __, { req }) => {
            try {
                const deleteSession = () => {
                    return new Promise((resolve, reject) => {
                        return req.session.destroy((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        })
                    })
                }
                await deleteSession();
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