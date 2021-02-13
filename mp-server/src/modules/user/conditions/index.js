const models = require("../../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const checkValidPassword = function checkValidPassword(args) {
    if (args.password !== args.password2) return 'Passwords do not match';
    if (args.password.length < 6) return 'Password must be greater than 6 characters';
    return false;
}

const checkValidUser = async function checkValidUser(email) {
    let isValidEmail = validateEmail(email);
    if (!isValidEmail) throw "Invalid email address";
    const hasUser = await models.User.findAll({ where: { email } });
    if (hasUser.length > 0) throw "Email address already in use";
    return false;
}

const createUserCheck = async function createUserCheck(args) {
    let checkPasswordError = checkValidPassword(args);
    if (checkPasswordError) throw checkPasswordError;
    let checkUserError = await checkValidUser(args.email);
    if (checkUserError) throw checkUserError;
    return false;
}

const comparePassword = async function (encrypted, plainText) {
    const isMatch = await bcrypt.compare(plainText, encrypted);
    if (!isMatch) {
        return "Invalid Password";
    }
    return false;
}

module.exports = {
    createUserCheck,
    checkValidPassword,
    checkValidUser,
    comparePassword,
};