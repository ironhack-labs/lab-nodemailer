const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ['Pending confirmation', 'Active'],
    default: 'Pending confirmation'
  },
  confirmationCode:{
    type: String,
    unique: true,
  },
  email: String
  },{
  timestamps: true,
  versionKey: false
})
const User = mongoose.model('User', userSchema);
module.exports = User;
