const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const nodemailer = require('../config/nodemailer.config');

router.get("/login", (req, res) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true
  })
)

router.get("/profile", (req, res) => {
  res.render("auth/profile", {user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/confirm/:confirmCod", (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmCod })
    .then(user => {
      user.status = 'active'
      user.save()
      .then(() => {
        res.render("auth/confirm", { "message": 'Your account has been activated correctly, please login again' });
      })
      .catch(() => {
        res.render("auth/resend", { message: "Something went wrong please enter your email to send it again" });
      })
    })
    .catch(() => {
      res.render("auth/resend", { message: "Something went wrong please enter your email to send it again" });
    })
});

router.post("/resend", (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    nodemailer.sendValidationEmail(user.email, user.confirmationCode, user.username);
    res.render("auth/signup", { message: "Check your email for activation" });
  })
  .catch(err => {
    res.render("auth/signup", { message: "Something went wrong" });
  })

});
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
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
      email
    });

    newUser.save()
    .then(user => {
      nodemailer.sendValidationEmail(user.email, user.confirmationCode, user.username);
      res.render("auth/signup", { message: "Check your email for activation" });
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
