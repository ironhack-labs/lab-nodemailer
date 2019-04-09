const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    confirmationCode: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      default: "Pending confirmation",
      enum: ["Pending confirmation", "Active"]
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);