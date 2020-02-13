const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    status: {type: String, enum:['Pending Confirmation']},
    confirmationCode: String,
    email: String
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
