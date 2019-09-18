const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String },
  username: { type: String },
  password: { type: String },
  status: { type: String, enum: ['Pending Confirmation', 'Active'] },
  confirmationCode: { type: String, unique: true }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
