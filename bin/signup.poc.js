require('../configs/db.config');
const mongoose = require("mongoose");
const User = require("../models/User.model");

const newUser = new User({
status: "Pending Confirmation",
_id: "5f16b20203bbb817598058e7",
username: "Test",
email: "test@test.com",
password: "12345678",
confirmationCode: "SA5E3V6rQWAVsJarhWcZ69e3P"
});

newUser.save()
    .then(user => console.log(user))
    .catch(e => console.error(e));