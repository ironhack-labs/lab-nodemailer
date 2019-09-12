const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ['PENDING CONFIRMATION', 'ACTIVE'],
    default: 'PENDING CONFIRMATION'
  },
  confirmationCode: {
    unique: true,
    type: String
  },
  email: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
