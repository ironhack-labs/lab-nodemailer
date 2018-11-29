const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ["Pending Confirmation","Active"],
    default: "Pending Confirmation"
}, 
    confirmationCode: [],
    email: String
},{
  timestamps: {
    createdAt: true,
    updatedAt: true  
  }
});
