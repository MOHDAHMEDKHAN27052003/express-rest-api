const User = require("../models/User");

const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'This email already exist'
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
        if(error.code===11000){
            return res.status(400).json({
                success:false,
                message:'This email already exists'
            })
        }
        console.error("Error signing up!", error.message);
    }
}

module.exports = { signupUser };