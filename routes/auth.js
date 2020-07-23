const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User.model");
const nodemailer = require('../configs/mailer.config');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  checkForEmptyFields(req.body);
  checkForDuplicates(req.body.username);
  const newUser = new User(req.body);


  newUser.save()
  .then(user => {
    nodemailer.sendValidationEmail(user.email);
    res.send('Check your mailbox');
  })
  .catch(next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;




function checkForEmptyFields(formData) {
  if (!formData.username || !formData.password) {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }
}

function checkForDuplicates(field) {
  User.findOne({field}, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }
  });
}