const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email:String,
  confirmationCode:{type:String,unique:true},
  status:{type:String, enum:['Pending Confirmation','Active'], default:'Pending Confirmation'} ,
  username: String,
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
