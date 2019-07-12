const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  const {username, password, email} = req.body 
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let confirmationCode = '';
for (let i = 0; i < 25; i++) {
  confirmationCode += characters[Math.floor(Math.random() * characters.length )];
}
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

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
      var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4b770d89bf0baa",
          pass: "e9f38ace9fbfd1"
        }
      });

      transport.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: 'Confirmation', 
        text: `http://localhost:3000/auth/confirm/${confirmationCode}`,
        html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">confirm your profile</a>`
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))
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

router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {status: 'Active'})
  .then(() => res.render("auth/confirmation"))
  .catch(res.render("auth/login", { "message": req.flash("error") }))
});

module.exports = router;
