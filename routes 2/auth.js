const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../config/nodemailer.config')

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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = {
      username,
      password: hashPass,
      confirmationCode: token,
      email
    }

    User.create(newUser)
      .then((user) => {
        mailer.sendMail({
          from: '"Sara&Juan Email 👻" <myawesome@project.com>',
          to: user.email,
          subject: `Bienvenid@ amiguis`,
          text: `http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        })
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});


//NOS HEMOS QUEDAO AQUIII, NO SABEMOS HACERLO :(
router.post('/confirm/:confirmCode', (req, res, next) => {
  userID = req.params.confirmCode

  console.log(userID)
})


User.findOne({ username }, "username", (err, user) => {


  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  module.exports = router;
