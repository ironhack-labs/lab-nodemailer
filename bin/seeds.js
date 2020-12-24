const mongoose = require("mongoose");
require('../configs/db.config');
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

const bcryptSalt = 10;

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    email: 'alice@test.com'
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'bob@test.com'
  }
]

User.deleteMany()
.then(() => {
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
.then(() => {
  mongoose.disconnect();
})
.catch(err => {
  mongoose.disconnect()
  throw err
})