const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' } // 15 minutes
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' } // 7 days
    );
};

const generateTokens = (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return { accessToken, refreshToken };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
};