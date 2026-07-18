const User = require("../models/User");

const getProfile = async (req, res) => {
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

const putProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (email && email !== user.email) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'This email already exists'
                })
            }
        }

        const putUser = await User.findByIdAndUpdate(
            id,
            { name, email, password },
            { returnDocument: 'after' }
        )

        res.status(200).json({
            success: false,
            message: 'User updated successfully',
            data: putUser
        })
    } catch (error) {
        console.error('Error updating user', error.message);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

module.exports = { getProfile, putProfile };