const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  status: {
    type: String, 
    enum: ['Pending Confirmation', 'Active'], 
    default: "Pending Confirmation"
  },
  confirmationCode: { type: String},
  email: {type: String}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
