const User = require("../models/User");
const errorResponse = require("../utils/serverErrorResponse");
const { generateTokens, verifyToken } = require("../utils/token");

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

        user.refreshTokens.push({
            token: refreshToken,
            deviceInfo: req.headers['user-agent'] || 'Unknown device',
            createdAt: new Date()
        });

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

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        user.refreshTokens.push({
            token: refreshToken,
            deviceInfo: req.headers['user-agent'] || 'Unknown device',
            createdAt: new Date()
        });

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

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}!`,
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
            const user = await User.findOne({ 'refreshTokens.token': refreshToken });
            
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
                
                if (user.refreshTokens.length === 0) {
                    user.isAuthenticated = false;
                }

                await user.save();
            }
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

const updateTokens = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided!'
            });
        }

        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired refresh token!'
            });
        }

        const user = await User.findOne({ 
            _id: decoded.userId,
            'refreshTokens.token': refreshToken 
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token!'
            });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
        
        user.refreshTokens.push({
            token: newRefreshToken,
            deviceInfo: req.headers['user-agent'] || 'Unknown device',
            createdAt: new Date()
        });

        await user.save();

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Tokens updated successfully!'
        });
    } catch (error) {
        errorResponse(res, error);
    }
};

module.exports = { signup, signin, signout, updateTokens };