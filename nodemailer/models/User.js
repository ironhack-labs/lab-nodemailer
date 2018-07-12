const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {type: String, enum:["Pending Confirmation", "Active"], default: "Pending Confirmation"},
  confirmationCode: {type: String, unique},
  email: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;


/* 
status. Will be a string, and you should add an enum because the only possibles values are: "Pending Confirmation" or "Active". By default, when a new user is created, it will be set to "Pending Confirmation".
confirmationCode. Here we will store a confirmation code you will attach to the URL. It will be unique for each user.
email. The user will complete the signup form with the email they will use to confirm the account. */