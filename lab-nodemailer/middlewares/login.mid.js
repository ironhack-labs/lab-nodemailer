const mongoose = require ("mongoose")
const User = require ("./../models/User")

module.exports.accountActivated = (req, res, next) => {
  let token = req.params.token

  User.findOne({confirmationCode: token}).then(userFound => {
    if (userFound) {
      if (userFound.status === "Pending Confirmation") {
        next()
      } else {
        res.redirect("/auth/account-already-activated")
      }
    }
  }).catch(err => {
    console.log("Error:", err)
  })
}

module.exports.loginWithPendingAccount = (req, res, next) => {
  let {username} = req.body

  console.log("Usernameee", username)

  User.findOne({username, status: "Pending Confirmation"}).then(userFound => {
    console.log(userFound)
    if (userFound) {
      res.redirect("/auth/confirm-your-email")
    } else {
      next()
    }
  })
}
