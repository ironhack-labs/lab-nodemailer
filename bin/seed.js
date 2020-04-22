const mongoose = require('mongoose')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const bcryptSalt = 10


mongoose
    .connect(`mongodb://localhost/ExpressNodemailer`, { useNewUrlParser: true, useUnifiedTopology: true })

const users = [  {
    username: "soloConCoco",
    password: bcrypt.hashSync("papasarrugas", bcrypt.genSaltSync(bcryptSalt)),
  },
  {
    username: "HolicarColi",
    password: bcrypt.hashSync("sassmolamas", bcrypt.genSaltSync(bcryptSalt)),
    }]

User.create(users)
    .then(user => mongoose.connection.close())
    .catch(err => console.log('Error al hacer seed', err)) 