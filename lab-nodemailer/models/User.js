const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  password: String,
  status:{
    type:String,
    enum:["Pending Confirmation", "Active"],
    default:"Pending Confirmation"
  },
  confirmationCode:{
    type:String,
    unique:true
  },
  email:String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.plugin(passportLocalMongoose,{usernameField:'email'})
module.exports = mongoose.model('User', userSchema);
