const User = require("../models/User");
const errorResponse = require("../utils/errorHandler");

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        errorResponse(res, error, 500);
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const allowedUpdates = ['name', 'email', 'password'];
        const isValidOperation = Object.keys(updates).every(field =>
            allowedUpdates.includes(field)
        );

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid update fields!'
            })
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: 'false',
                message: 'User not found!'
            })
        }

        Object.keys(updates).forEach(key => {
            user[key] = updates[key]
        })

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: user
        })
    } catch (error) {
        if (error.code = 11000) {
            res.status(400).json({
                success: false,
                message: "This email already exist!"
            })
        }

        errorResponse(res, error, 500);
    }
}

module.exports = { getUser, updateUser };