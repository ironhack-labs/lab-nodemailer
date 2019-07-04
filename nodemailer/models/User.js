const { model, Schema } = require("mongoose");

const plm = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    username: String,
    password: String,
    status: {
      type: String,
      enum: ["Pending confirmation", "Active"],
      default: "Pending Confirmation"
    },
    email: String,
    confirmationCode: { type: String, unique: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.plugin(plm, { usenameField: "username" });
module.exports = model("User", userSchema);
