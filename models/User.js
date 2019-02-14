const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  password: {
    type:String,
    required:true,
  },
  status:{
    type:String,
    enum: ["Active", "Pending Confirmation"],
    default:"Pending Confirmation"
  },
  confirmationCode: {
    type:String,
    default: ""
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
