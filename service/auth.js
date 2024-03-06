const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.JWT_SECRET;
//console.log(secretKey);
function setUser(user) {
    try {
        return jwt.sign(user, secretKey);
    } catch (error) {
        console.error("Error while signing JWT:", error);
        throw error; // You may choose to handle or log the error accordingly
    }
}

function getUser(token) {
    if (!token) return null;

    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.error("Error while verifying JWT:", error);
        return null; // Invalid token or expired token, handle it accordingly
    }
}

module.exports = { getUser, setUser };
