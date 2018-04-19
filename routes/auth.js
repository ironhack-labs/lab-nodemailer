const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
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
    const confirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.render("auth/email-send", {newUser});
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "testingemailnano@gmail.com",
      pass: process.env.MAILPWD
    }
  });
  transporter
    .sendMail({
      from: '"My Awesome Project 👻" <myawesome@project.com>',
      to: email,
      subject: subject,
      text: message,
      html: `<b>${message}</b>`
    })
    .then(info => res.render("auth/email-sent", { email, subject, message, info }))
    .catch(error => console.log(error));
});

authRoutes.get("/confirm/:confirmCode", (req, res) => {
  const user = User.findOneAndUpdate({confirmationCode: req.query.confirmCode}, {status: 'Active'}, () => {
    console.log(`User ${user.username} confirmed! :)`);
  })
  res.render("auth/confirmation", {user});
});

module.exports = authRoutes;
