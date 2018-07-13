const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String,unique:true},
  password: String,
  status: {type: String, enum:["Pending Confirmation","Active"]},
  email: {type: String},
  confirmationCode: {type:String, unique:true}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'

  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
