const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING CONFIRMATION'],
      default: 'PENDING CONFIRMATION'
    },
    confirmCode: {
      type: String,
      unique: true
    },
    email: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
