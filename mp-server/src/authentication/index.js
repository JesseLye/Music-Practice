const jwt = require("jsonwebtoken");

const decodeUserIdFromJwtAuthorizationHeader = function (headers) {
    if (!headers.authorization)
        throw "Authorization Header Not Found";
    const token = headers.authorization.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifyToken)
        throw "Token Was Not Able To Be Verified";
    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
    if (!decodedToken)
        throw "Token Was Not Able To Be Decoded";
    return decodedToken.id;
}

module.exports = {
    decodeUserIdFromJwtAuthorizationHeader
};