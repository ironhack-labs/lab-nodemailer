const {
    Schema,
    model
} = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
    email: String,
    name: String,
    status: {
        type: String,
        enum: ['Pending Confirmation', 'Active'],
        default: 'Pending Confirmation'
    },
    confirmationCode: String
}, {
    timestamps: true,
    versionKey: false
})

userSchema.plugin(PLM, {
    usernameField: 'email'
})

module.exports = model('User', userSchema)