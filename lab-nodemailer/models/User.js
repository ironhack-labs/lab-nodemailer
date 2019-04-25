const mongoose = require('mongoose');

const confCode = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }
  if (!token == '') {
    return token
  }
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique:true,
    required:true
  },
  password:  {
    type: String,
    unique:true,
    required:true
  },
    confirmationCode: {
      type: String,
      default: confCode()
  },
  status: {
    type: String,
    enum: ['Pending Confirmation',"Active"],
    default: 'Pending Confirmation'
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
}, 
{
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
