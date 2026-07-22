const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const { generateTokens } = require("../utils/token");

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

        const { accessToken, refreshToken } = generateTokens(user._id);

        user.refreshToken = refreshToken;
        
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "You're signed up successfully!",
            data: user
        });

    } catch (error) {
        errorResponse(res, error, 500);
    }
};

module.exports = signup;