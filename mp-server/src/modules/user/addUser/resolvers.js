const {
    createUserCheck,
} = require("../conditions");
const bcrypt = require("bcrypt");

exports.resolvers = {
    Mutation: {
        addUser: async (_, args, { req, models }) => {
            try {
                await createUserCheck(args);
                const { email, password } = args;
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                const newUser = await models.User.create({ email: email, password: hash });
                req.session.userId = newUser.id;
                return {
                    id: newUser.id,
                    email: newUser.email,
                    status: {
                        ok: true,
                    },
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
}