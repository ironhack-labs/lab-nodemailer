const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt)

const userSchema = new Schema({
    username: String,
    password: String,
    status: {
        type: String,
        enum: ["Pending Confirmation", "Active"],
        default: ["Pending Confirmation"],
    },
    confirmationCode: String,
    email: String

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;