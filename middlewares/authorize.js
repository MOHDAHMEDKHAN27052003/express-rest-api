const User = require('../models/User');
const errorResponse = require('../utils/serverError');

const authorize = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'librarian') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only librarians can create books.'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = authorize;