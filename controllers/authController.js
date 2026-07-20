const User = require("../models/User");
const errorResponse = require("../utils/errorHandler");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email already exist'
            })
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "You're signed up successfully!",
            data: user
        });

    } catch (error) {
        console.error("Error signing up!", error.message);

        errorResponse(res, error, 500);
    }
}

module.exports = signup;