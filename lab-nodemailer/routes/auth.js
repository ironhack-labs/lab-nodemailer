require('dotenv').config();
const express = require("express");
const passport = require('passport');
const transporter = require('../mail/transporter');
const router = express.Router();
const User = require("../models/User");



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
    const hashCode = bcrypt.hashSync(username, salt)

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashCode
    });

    const sendMail = () => {
      return transporter.sendMail({
        from: '"My Awesome Project 👻" <ironnodemail89@gmail.com>',
        to: email,
        subject: 'Awesome Subject',
        text: 'Awesome Message',
        html: `<a>http://localhost:3000/auth/confirm/${newUser.confirmationCode}</a>`,
      })
    }

    newUser.save() 
    .then((user) => {
      sendMail(user).then(() => {
        res.redirect('/');
      })
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
