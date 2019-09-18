const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  active: { type: Boolean, default: false },
  confirmationCode: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
