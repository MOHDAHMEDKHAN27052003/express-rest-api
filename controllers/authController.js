const User = require("../models/User");
const errorResponse = require("../utils/serverErrorResponse");
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
        user.isAuthenticated = true;
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}!`,
            data: user
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

const signout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken },
                { 
                    $unset: { refreshToken: "" },
                    isAuthenticated: false 
                }
            );
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Successfully signed out!'
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = { signup, signout };