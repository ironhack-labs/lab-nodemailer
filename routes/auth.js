const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const transporter = require('../mail/transporter');
require('dotenv').config();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { user: req.user});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const confirmationCode = token;

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
      email, 
      confirmationCode: confirmationCode,
    });

    newUser
      .save()
      .then(() => {

        console.log(newUser);

        transporter.sendMail({
          from: 'Ironhack DE',
          to: newUser.email,
          subject: 'Confirmation email',
          text: 'Awesome Message',
          html: `<a href="http://localhost:3000/auth/confirm/${newUser.confirmationCode}">http://localhost:3000/auth/confirm/${newUser.confirmationCode}<a>`,
        })

        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: err });
      });
  });
});

router.get("/confirm/:code", (req, res) => {
  console.log(req.params.code);
  User.findOneAndUpdate({confirmationCode: req.params.code}, { $set: { status: 'Active' }}, {new:true})
  .then((user) => {
    console.log(user);
    res.render("confirmation", { user});
  });
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
