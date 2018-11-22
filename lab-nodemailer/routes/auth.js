const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const transporter = require('../mail/trasnporter');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.get("/confirm/:confirmCode", (req, res, next) => {

  if (!req.user) {
    res.render("auth/confirmation", { message: 'User inactive. Please login.' });
  } else if (req.user.confirmationCode === req.params.confirmCode) {
    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { $set: { status: "Active" } }, { new: true })
      .then(() => {
        res.render("auth/confirmation", { message: 'User active.' });
      }).catch(() => {
        res.render("auth/confirmation", { message: 'Error activation.' });
      })
        
  }

});

router.get("/profile", ensureLoggedIn('/login'), (req, res, next) => {

  User.findById(req.user._id)
    .then(user => {
      res.render('auth/profile', { user });
    })
    .catch(err => {
      console.error(err);
    })
});

router.post("/login", ensureLoggedOut(), passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", ensureLoggedOut(), (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", ensureLoggedOut(), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';

  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email, NOW!!!" });
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
      .then(user => {
        transporter.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: 'jacinlotar@gmail.com',
          subject: 'Prueba',
          text: `http://localhost:3000/auth/confirm/${confirmationCode}`,
        })
          .then(() => res.render(`auth/profile`, { user }))
          .catch(err => console.log(err));

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
