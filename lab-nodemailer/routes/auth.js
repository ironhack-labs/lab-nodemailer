const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USERACC,
    pass: process.env.PASSACC
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
      email: email,
      confirmationCode: token
    });

    newUser
      .save()
      .then(() => {
        transporter
          .sendMail({
            from: '"My Awesome Project 👻" <myawesome@project.com>',
            to: email,
            subject: "Awesome Subject",
            text: "Awesome Message",
            html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Confirmation email</title>
        </head>
        <body>

        Congratulations! Just click here and you will have completed your email validation process!

          <a href="http://localhost:3000/auth/confirm/${token}" target="_blank"><button>Confirm</button></a>
        </body>
        </html>`
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));
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
  // let token = req.params.token;
  User.findOneAndUpdate(
    { confirmationCode: req.params.token },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(user => {
      console.log("User activated");
      res.redirect("/auth/confirmation")
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/confirmation", (req, res) =>{
  res.render("auth/confirmation")
} )

router.get("/profile", (req, res) =>{
  res.render("auth/profile")
} )

module.exports = router;
