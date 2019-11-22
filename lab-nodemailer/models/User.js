const {
  model,
  Schema
} = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  email: String,
  username: String,
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation',
  },
  confirmationCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
})


module.exports = model('User', userSchema)