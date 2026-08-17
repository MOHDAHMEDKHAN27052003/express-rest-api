const errorResponse = require('../utils/serverError');
const { verifyToken } = require('../utils/tokens');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token not found'
            });
        }

        const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        req.userId = decoded.userId;

        next();

    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        errorResponse(res, error);
    }
};

module.exports = authenticate;