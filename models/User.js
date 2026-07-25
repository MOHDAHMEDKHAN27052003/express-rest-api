const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    refreshToken: { type: String },
    isAuthenticated: { type: Boolean, default: false }
},
    { timestamps: true }
);

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt();

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified('refreshToken')) {
        this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
    }
});

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.compareRefreshToken = async function (plainRefreshToken) {
    return await bcrypt.compare(plainRefreshToken, this.refreshToken);
};

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.refreshToken;

        return ret;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;