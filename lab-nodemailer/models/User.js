const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  status: {
    type: String,
    enum: ["PENDING CONFIRMATION", "ACTIVE"],
    default: "PENDING CONFIRMATION",
  },
  confirmationCode: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }

});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})
const User = mongoose.model('User', userSchema);
module.exports = User;



 