const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User.model");
const nodemailer = require('../configs/nodemailer.config');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/profile', (req, res, next) => {
  User.findById(req.session.passport.user)
    .then(user => {
      if(user) {
        if (user.status === 'active') {
          res.render('auth/profile', {user})
        } else {
          res.render('auth/login', {
            messageActive: "You should active your account"
          })
        }
      }
    })
    .catch((next))
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {username, password, email } = req.body
  if (username === "" || password === "" || email === '') {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const hashPass = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      password: hashPass,
      email
    });

    newUser.save()
    .then(() => {
      User.findOne({username})
        .then(user => {
          const {username, email, confirmationCode} = user
          nodemailer.handleForm(username, email, confirmationCode)
          res.redirect("/");
        })
        .catch(next)
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:confirmationCode', (req, res, next) => {
   User.findOne({confirmationCode : req.params.confirmationCode})
      .then(user => {
        if (user){
        user.status = "active"
        user.save()
            .then(() => res.render('auth/confirmation', { message : "You account is active"}))
            .catch(() => res.render('auth/confirmation', { message : "Error, try again later"}))
        }
      })
      .catch((e) => console.log("error", e))
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;