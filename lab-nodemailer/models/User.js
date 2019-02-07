const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String, 
    enum: ["Pending Confirmation", "active"], 
    default: "Pending Confirmation" 
  },
  confirmationCode: { type: String, unique: true },
  email: { type: String, unique: true, required: true }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
