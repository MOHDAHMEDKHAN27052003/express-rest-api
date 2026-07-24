const User = require("../models/User");
const errorResponse = require("../utils/serverErrorResponse");
const { generateTokens } = require("../utils/token");
const jwt = require("jsonwebtoken");

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
        errorResponse(res, error);
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findOne({
            _id: decoded.userId,
            refreshToken: refreshToken
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Tokens updated successfully!'
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized access blocked!',
            error: error.message
        })

        errorResponse(res, error);
    }
};

module.exports = { signup, refreshToken };