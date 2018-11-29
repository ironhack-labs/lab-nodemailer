const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
  username: String,
  password: String,
  status:{
    type:String,
    enum:["Pending Confirmation", "Active"],
    default: "Active",
  },
  confirmationCode:{
    type:String,
    unique:true,
  },
  email: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


userSchema.plugin(passportLocalMongoose, {usernameField:"email"})

const User = mongoose.model('User', userSchema);
module.exports = User;
