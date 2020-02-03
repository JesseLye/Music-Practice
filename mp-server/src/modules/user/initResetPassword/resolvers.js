const { v4 } = require("uuid");
const nodemailer = require("nodemailer");
const {
    setRedisKey
} = require("../../../../utils/redisPromisified");

exports.resolvers = {
    Mutation: {
        initResetPassword: async (_, args, { models, redisClient }) => {
            try {
                const foundUser = await models.User.findOne({ where: { email: args.email } });
                if (!foundUser) {
                    throw "User not found";
                }
                var smtpTransport = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.GMAILUSER,
                        pass: process.env.GMAILPW
                    }
                });
                const id = v4();
                
                await setRedisKey(redisClient, "forgotPassword", id, foundUser.id);
                var mailOptions = {
                    to: foundUser.email,
                    from: process.env.GMAILUSER,
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'localhost:4200/reset-password/' + id + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                await smtpTransport.sendMail(mailOptions);

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