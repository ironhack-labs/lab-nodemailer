const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Template email import
const template = require('../template/template');

//Email transporter NODEMAILER
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3df9b8f6f5538a",
    pass: "f88b3c0f8c97b8"
  }
});


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
  let token = "";

  crypto.randomBytes(48, function(err, buffer) {
    token = buffer.toString('hex');
  });

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
      confirmationCode: token,
      email
    });

    newUser.save()

    .then(() => {
      transport.sendMail({
        from: "'Email confirmation' <example@gmail.com>",
        to: email,
        subject:"Confirm your email",
        text:"Click on the link to confirm your register",
        html:`<a href="http://localhost:3000/auth/confirm/${token}">Click here</a>`
      })
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:token', (req, res) => {
  let { token } = req.params;

  User.findOneAndUpdate({ confirmationCode: token }, { status: 'Active'})
  .then( response => {
    console.log(response);
    res.redirect('/');
  })
  .catch( error => {
    console.log(error);
    res.redirect('/signup');
  })
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
