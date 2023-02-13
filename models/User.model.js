const { Schema, model } = require("mongoose");
// import { isEmail } from "validator";
// import isEmail from "validator/lib/isEmail";
const validator = require("validator");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      requiered: [true, "please tell us your username!"],
    },
    password: String,
    status: {
      type: String,
      enun: ["Pending Confirmation", "Active"],
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

// ...

// const EmailSchema = new Schema({});
