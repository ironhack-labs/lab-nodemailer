const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
   type: String,
   enum: ['Pending of confirmation', 'Active'],
   default: 'Pending of confirmation'
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  email: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false
});


const User = mongoose.model('User', userSchema);
module.exports = User;
