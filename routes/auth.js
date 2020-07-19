const express = require("express")
const passport = require("passport")
const router = express.Router()
const User = require("../models/User")
const nodemailer = require("nodemailer")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") })
})

router.get("/profile", (req,res,next) =>{
  User.findOne(req.body.username)
  .then((user) =>{
    console.log(user)
    res.render('auth/profile',{user})
  })
  .catch(e=>console.log('username nost found',e))
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true,
  })
)

router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
})

router.post("/signup", (req, res, next) => {
  //const username = req.body.username;
  //const password = req.body.password;
  const { username, password, email } = req.body
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" })
    return
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const createdCode = createConfirmationCode()
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: createdCode,
    })

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "giuseppe.bernier89@ethereal.email",
        pass: "DSQvVTfbZvWgKrpqUg",
      },
    })

    newUser
      .save()
      .then(() => {
        transporter
          .sendMail({
            from: '"Activation Test" <giuseppe.bernier89@ethereal.email>',
            to: email,
            subject: "Activate Account",
            text: "Activate you account",
            html: `
            <div>Click to activate your account</div>
            <div>http://localhost:3000/auth/confirm/${createdCode}</div>
            `,
          })
          .then((info) => console.log("email sent", info))
          .catch((error) => console.log(error))
        res.redirect("/")
      })
      .catch((err) => {
        res.render("auth/signup", { message: "Something went wrong" })
      })
  })
})

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmCode })
  .then((user) => {
    if (user) {
      user.status = "Active"
      user
        .save()
        .then((user) => {
          res.render("auth/confirmation", { user })
        })
        .catch((e) => next)
    } else {
      console.log("invalid link")
      res.render("/")
    }
  })
})

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

const createConfirmationCode = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let token = ""
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }

  return token
}

module.exports = router
