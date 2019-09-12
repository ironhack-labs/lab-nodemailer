const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function generateCode() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i=0; i< 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const generateCode = generateCode()
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      status,
      confirmationCode
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

let { subject, message } = req.body

message = `htttp://localhost:${PORT}/auth/confirm/${confirmationCode}`
transporter.sendMail({
  from: `"Ediehacker Email" <ironhacker@project.com>`,
  to: email,
  subject: subject,
  text: message,
  html: `<b>${message}</b>`
})

.then(info => res.render("message", { email, subject, message, info}))
.catch(error => console.log(error));

})

router.get("/confirm/:confirmCode", (req, res, next) =>{
const codeId = req.params.confirmCode
User.find({confirmationCode: codeId})
  .then(user => {  
    user.status = "Active"
  res.render('auth/confirmation', {user})})
  .catch(err => console.log("Hubo un error", err))

})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
