const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateToken = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token
}

const userSchema = new Schema({
    username: String,
    password: String,
    status: {
        type: String,
        default: 'Pending Confirmation',
        enum: ['Pending Confirmation', 'Active'],
    },
    confirmationCode: {
        type: String,
        unique: true,
        default: generateToken
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, "Email is invalid"],
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;