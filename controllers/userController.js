const User = require("../models/User");
const errorResponse = require("../utils/serverErrorResponse");

const getUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        errorResponse(res, error, 500);
    }
}

const updateUser = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['name', 'email', 'password'];
        const isValidOperation = Object.keys(updates).every(field =>
            allowedUpdates.includes(field)
        );

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid update fields!'
            });
        }

        const user = req.user;

        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: user
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "This email already exists!"
            });
        }
        errorResponse(res, error, 500);
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        
        res.clearCookie('accessToken');

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully!'
        });
    } catch (error) {
        errorResponse(res, error, 500);
    }
}

module.exports = { getUser, updateUser, deleteUser };