const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const makeCode = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Missing field'],
    unique: [true, 'Username must be unique']
  },
  password: {
    type: String,
    required: [true, 'Missing field']
  },
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
  },
  confirmationCode: {
    type: String,
    default: makeCode
  },
  email: {
    type: String,
    required: [true, 'Missing field'],
    unique: [true, 'This email is already registered']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(e => next(e));
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;