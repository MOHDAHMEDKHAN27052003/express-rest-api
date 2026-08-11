const User = require('../models/User');
const errorResponse = require('../utils/serverError');

const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = {
    getProfile
};