const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: String, 
    enum: ['Pending confirmation', 'Active'],
    default: 'Pending confirmation'
  },
  confirmationCode: {
    unique: true
  },
  email: {
    type: String
  }
}
);

const User = mongoose.model("User", userSchema);

module.exports = User;