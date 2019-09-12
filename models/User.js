const { model, Schema } = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String,
  email: {
    type: String,
    require: true,
    unique: true
  },
  confirmationCode: String
});

userSchema.plugin(plm, { usernameField: 'email' });

module.exports = model('User', userSchema);
