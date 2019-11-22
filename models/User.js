const { Schema, model } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema( 
  {
    username: String,
    email: String,
    status: {
      type: String,
      enum: ["Pending Confirmation", "Active"],
      default: "Pending Confirmation",
    },
    token: String,
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = model("User", userSchema);