require('dotenv').config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS 
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = getConfirmationCode();

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
      confirmationCode
    });

    newUser
      .save()
      .then(user => {
        sendEmail(user)
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res) => {
  const cCode = req.params.confirmCode;
  User.findOne({confirmationCode : cCode})
  .then(user => {
    user.status = "Active";
    user.save()

    res.render("auth/confirmation", {user: user})
  })
  .catch(err =>{
    res.redirect("auth/signup");
  })
})

function getConfirmationCode() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

function sendEmail (user){
  transporter.sendMail({
    from: '"My Awesome Project" <myawesome@project.com>',
    to: user.email, 
    subject: `Welcome ${user.username}`, 
    text: `Ironhack Confirmation Email. Thanks to join our community! Please confirm your account clicking on the following link http://localhost:3000/auth/confirm/${user.confirmationCode}`,
    html: `<b>Ironhack Confirmation Email</b>.<br><br>Thanks to join our community! Please confirm your account clicking on the following <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">link</a>`
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}

module.exports = router;
