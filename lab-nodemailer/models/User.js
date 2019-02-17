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
  password:{
    type:String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending confirmation'],
    default: 'Pending confirmation'
  },
  confirmationCode:{
    type: String,
    default:''
  },
  },{
  timestamps: true,
  versionKey: false
})
const User = mongoose.model('User', userSchema);
module.exports = User;
