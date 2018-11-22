const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const transporter = require('../mail/transporter');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


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
  const email = req.body.email;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    const newUser = new User({
      username,
      email: email,
      password: hashPass, 
      confirmationCode: token
    });

    newUser.save()
    .then((user) => {
      transporter.sendMail({
        from: '"Ironhack Test" <soniaruiztests@gmail.com>',
        to: user.email,
        subject: 'Confirmation',
        text: 'Confirmation',
        html: `<a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">Confirm account<a>`,
      })
        .then(() => res.redirect("/"))
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

router.get("/confirm/:code", (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.code}, {$set: {status: 'Active'}})
    .then(user => {
      res.render('confirmed', {user});
    })
    .catch(err => {
      res.render("error");
    })
});

router.get("/profile", (req, res) => {
  User.findById(req.session.passport.user)
    .then(user => {
      if (user === null) {
        res.redirect('/')
      } else {
        res.render('profile', {user});
      }
    })
    .catch(err => {
      res.render('error');
    })
});

module.exports = router;
