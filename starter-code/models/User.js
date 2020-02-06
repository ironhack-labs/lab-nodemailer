const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
  },
  confirmationCode: String,
  email: String
}, {
  timestamps: true
});

userSchema.plugin(PLM, {usernameField: 'email'})
const User = mongoose.model('User', userSchema);
module.exports = User;
