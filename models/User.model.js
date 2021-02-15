// User model here
const { Schema, model } = require('mongoose');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            match: [EMAIL_PATTERN, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.']
        },
        active: {
            type:Boolean,
            default:false
        },
        activationToken: {
            type:String,
            default: () => {
                return (
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
                )
            }
        }
    },

    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);
