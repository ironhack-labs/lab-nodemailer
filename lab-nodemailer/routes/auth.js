const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const nodemailer = require("nodemailer");
const templates = require("../public/javascripts/template");

router.get("/personal-view", (req, res, next) => {
  let user = req.user;

  if (user) {
    res.render("profile", user);
  }
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmCode },
    { status: "Active" }
  )
    .then(user => {
      let sucessMessage = `Welcome, ${user.username}!`;
      res.render("confirmation", { message: sucessMessage });
    })
    .catch(err => {
      res.render("confirmation", { message: err });
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
)

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
  const confirmationCode = token;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate complete the form" });
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
      confirmationCode,
      email
    });

    newUser
      .save()
      .then(response => {

        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });

        const message = `http://localhost:3000/auth/confirm/${confirmationCode}`

        transporter.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: email,
          subject: "Account confirmation",
          text: message,
          html: templates.templateExample(message, username)
        });
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

module.exports = router;
