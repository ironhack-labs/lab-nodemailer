const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: String,
    password: String,
    status: {
        type: String,
        enum: ["Pending Confirmation", "Active"],
        default: "Pending Confirmation"
    },
    confirmationCode: String,
    email: String
})

const User = mongoose.model('UserDB', userSchema)
module.exports = User