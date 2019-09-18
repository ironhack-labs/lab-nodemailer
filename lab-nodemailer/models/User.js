const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const randToken = require("rand-token");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    status: {
      type: String,
      enum: ["Pending Confirmation", "Active"]
    },
    confirmationCode: {
      type: String,
      unique: true,
      default: randToken.generate(25)
    },
    email: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
