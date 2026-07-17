const User = require("../models/User");

const signupUser = async (req, res) => {
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

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

const userProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Error fetching user!", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = { signupUser, userProfile };