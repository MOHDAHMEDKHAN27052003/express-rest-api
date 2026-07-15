const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
},
    { timestamps: true }
);

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;