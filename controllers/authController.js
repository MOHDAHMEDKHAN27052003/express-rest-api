const User = require("../models/User");
const errorResponse = require("../utils/serverErrorResponse");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email already exists!'
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}!`,
            data: user
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = { signup };