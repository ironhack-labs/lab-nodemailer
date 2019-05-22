const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ["pending confirmation", "active"],
    default: "pending confirmation"
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  email: {
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
