const User = require("../models/User");

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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
    }
}

module.exports = { signupUser };