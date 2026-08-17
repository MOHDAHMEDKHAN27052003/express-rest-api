const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    role: { 
        type: String, 
        enum: ['librarian', 'student'],
        default: 'student'
    },
    refreshTokens: [{
        token: String,
        deviceInfo: String,
        createdAt: Date
    }],
    isAuthenticated: { type: Boolean, default: false }
},
    { timestamps: true }
);

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt();

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, salt);
    };
});

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.refreshTokens;

        return ret;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;