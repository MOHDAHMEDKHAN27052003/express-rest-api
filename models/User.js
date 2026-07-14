const { default: bcrypt } = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
},
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;