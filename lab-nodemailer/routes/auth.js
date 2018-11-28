require('dotenv').config();
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../email/sendMail');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {"message": req.flash("error")});
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
  const {username, email, password} = req.body;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {message: "Indicate username, email and password"});
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });

    newUser.save()
    .then((newUser) => {
      //console.log(newUser);
      sendMail(newUser.email,'Confirmation link', newUser.username, newUser.confirmationCode);
      res.render("index", {message: "Please, check you email address to confirm your email!"});
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", {message: "Something went wrong"});
    })

  });
});

router.get('/confirm/:confirmCode', (req, res) => {
  const confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({confirmationCode: confirmCode}, {status: 'Active'}).then((user) => {
    console.log(user, 'active');
    res.render("auth/confirmation", {user});
  }).catch((err) => {
    console.log(err, 'No funsiona');
    res.render("auth/confirmation", {message: "Your mail can't be confirmed. Please try again!"});
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
