const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.PASS

  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
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
  const email = req.body.email;

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username, password and email"
    });
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
      confirmationCode: token
    });

    newUser
      .save()
      .then(() => {
        transporter
          .sendMail({
            from: '"Hello" <iron@ironhack.com>',
            to: email,
            subject: "confirm your account",
            text: "ironhack",
            html: `<a href="http://localhost:3000/auth/confirm/${token}">¡Confirm your account!</a>`
          })
          
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:token", (req, res) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.token },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(user => {
      res.redirect("/auth/confirmation");
    })
    .catch(err => {
      res.redirect("/auth/error");
    });
});

router.get("/profile", (req, res, next) => {
  res.render("auth/profile", { user: req.user});
});

router.get("/confirmation", (req, res, next) => {
  res.render("auth/confirmation", { user: req.user});
});

router.get("/error", (req, res, next) => {
  res.render("auth/error", { user: req.user });
});

module.exports = router;