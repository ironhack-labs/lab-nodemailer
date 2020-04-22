const mongoose = require('mongoose')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10


mongoose
    .connect(`mongodb://localhost/nodemailer-yai`, { useNewUrlParser: true, useUnifiedTopology: true })

const users = [  {
    username: "yaizaMola",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "aryaTroll",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    }]
  
User.create(users)
    .then(data => mongoose.connection.close())
    .catch(err => console.log('Error al hacer seed', err))