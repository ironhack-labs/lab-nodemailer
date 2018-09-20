const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status:{type:String,enum:["Active","Pending confirmation"],default:"Pending confirmation"},
  confirmationCode:{type:String},
  email:String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
