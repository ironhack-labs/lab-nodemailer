const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {type: String, enum: ['Pending', 'Active'], default: 'Pending'},
  confirmationCode: {type:String, unique: true },
  email: String

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
