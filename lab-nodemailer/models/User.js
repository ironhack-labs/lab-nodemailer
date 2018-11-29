const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
    {
        username  : String,
        email     : String,
        confirmationCode: {
            type: String,
            unique: true
        },
        status: {
            type   : String,
            enum   : ['Pending Confirmation','Active'],
            default: 'Active'
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);