const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const confirmationCodeRandom = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  return token
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending confirmation", "active"],
    default : "pending confirmation"
  },
  confirmationCode : {
    type: String,
    unique : true,
    default: confirmationCodeRandom
  },
  email:  {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
