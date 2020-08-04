
var jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
    let result = null;
    try {
        const trueToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (trueToken) result = true;

    } catch (error) {
        result = false;
    }

    return result;
}

const decodeToken = async (token) => {
    const tokenVerified = await verifyToken(token);

    if(!tokenVerified) return false;

    return await jwt.decode(token);
}

module.exports = {
    verifyToken,
    decodeToken
};