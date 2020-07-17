const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

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

  },
  confirmationCode: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
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

const User = mongoose.model('User', userSchema);
module.exports = User;
