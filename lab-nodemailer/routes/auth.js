const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const { sendEmail } = require('../config/nodemailer')

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }
  const confirmationCode = token

  if (username === "" || password === "" || email === '') {
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

    newUser.save()
    .then(() => {
      sendEmail(email, confirmationCode)
      .then(()=>{
        console.log('Email sent')
      })
      .catch(err => console.log(err))
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:confirmationCode', (req, res, next) => {
  const confirmationCode = req.params.confirmationCode

  User.findOne({ confirmationCode })
  .then(user => {
    user.status = 'ACTIVE'
    const {username, status}= user
    res.render("confirmation", {username, status})
  })
  .catch(err => {
    res.send(err)
  })
})

router.get('/profile', (req, res, next) => {
  res.render("profile")
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
