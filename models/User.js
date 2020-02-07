const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
//const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  status:{
    type: String,
    enum:['Active', 'Disable'],
    default:'Disable'
  },
  confirmationCode:{
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

//userSchema.plugin(PLM, {usernameField: "username"})

const User = mongoose.model('User', userSchema);
module.exports = User;
