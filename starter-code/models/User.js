const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new Schema({
  username: String,
  password: String,
  status: {
    type: String,
    enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation",
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  email: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator);
module.exports = User;