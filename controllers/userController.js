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

const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.name = name;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your Name is updated successfully",
            data: user
        });

    } catch (error) {
        errorResponse(res, error);
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(200).json({
            success: true,
            message: 'Your account is deleted successfully'
        });

    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
};