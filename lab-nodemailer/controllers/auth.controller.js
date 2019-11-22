const User = require('../models/User')
const {
  sendEmail
} = require("../controllers/email")

exports.signupGet = (req, res) => {
  res.render('passport/signup')
}

exports.loginGet = (req, res) => {
  res.render('passport/login')
}

exports.confScreen = (req, res) => {
  res.render('conf-alert')
}

exports.signupPost = (req, res) => {
  const {
    email,
    password,
    username,
    status,
  } = req.body
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }
  User.register({
        email,
        username,
        status,
        confirmationCode
      },
      password
    )
    .then(async user => {
      await sendEmail(user.email, `Hi ${user.username}`, `http://localhost:3000/confirm/${confirmationCode}`)
      res.redirect("/conf-alert")
    })
    .catch(err => {
      if (err.email === "UserExistsError") {
        return res.render("passport/signup", {
          msg: "youre already a member queen"
        })
      } else {
        console.log(err)
      }
    })
}

exports.confirmAccount = async (req, res, next) => {
  const {
    confirmationCode
  } = req.params
  const user = await User.findOneAndUpdate({
    confirmationCode
  }, {
    status: "Active"
  }, {
    new: true
  })
  res.render("passport/profile", user)
}