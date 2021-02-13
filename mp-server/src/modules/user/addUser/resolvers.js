const {
    createUserCheck,
} = require("../conditions");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.resolvers = {
    Mutation: {
        addUser: async (_, args, { req, models }) => {
            try {
                await createUserCheck(args);
                const { email, password } = args;
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                const newUser = await models.User.create({ email: email, password: hash });
                const token  = jwt.sign({
                    id: newUser.id,
                  },
                  process.env.SECRET_KEY,
                  { expiresIn: "3d" }
                );
                return {
                    id: newUser.id,
                    email: newUser.email,
                    token,
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