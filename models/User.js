const {Schema, model} = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  email: {
    type: String,
    require: true,
    unique: true
  },
  confirmationCode: String
});

userSchema.plugin(PLM, {
  usernameField: 'email'
});

module.exports = model('User', userSchema);