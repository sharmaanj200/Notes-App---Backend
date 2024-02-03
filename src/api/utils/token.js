const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateAccessToken = ({ userId, email, role }) => {
    const token = jwt.sign(
        { userId, email, role },
        process.env.TOKEN_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );

    return token;
}

const generateCSRFToken = () => {
    const csrfToken = uuidv4();
    return csrfToken;
};

const generateRefreshToken = ({ userId, email, role }) => {
    const refreshToken = jwt.sign({ userId, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });
    return refreshToken;
};

const verifyToken = ({ token, type }) => {
    const secretObj = {
        access: process.env.TOKEN_KEY,
        refresh: process.env.REFRESH_TOKEN_SECRET,  
    }

    return jwt.verify(token, secretObj[type]);
}


module.exports = {
    generateAccessToken,
    generateCSRFToken,
    generateRefreshToken,
    verifyToken
};