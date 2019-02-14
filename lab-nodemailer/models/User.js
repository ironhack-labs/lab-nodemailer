const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status:{
    type:String,
    enum: ['Pending Confirmation', 'Active']
  },
  confirmationCode:{
    unique:true,
    type:String,
  },
  email: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;


// status - will be a string, and you should add an enum because the only possible values are: "Pending Confirmation" or "Active". 
// By default, when a new user is created, it will be set to "Pending Confirmation".
// confirmationCode - here we will store a confirmation code; it will be unique for each user.
// email - the user will complete the signup form with the email they will use to confirm the account.
