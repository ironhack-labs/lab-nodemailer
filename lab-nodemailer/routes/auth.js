const express = require("express");
const passport = require('passport');
const nodemailer = require("nodemailer");
const hbs        = require('hbs');
const authRoutes = express.Router();
const User = require("../models/User");
require('dotenv').config();
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
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
      email : email,
      confirmationCode: confirmationCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transporter.sendMail({
          from: `"Elliot and Ayumi" <${process.env.GMAIL_ADDRESS}>`,
          to: email,
          subject: "Signup Confirmation",
          text: "Please confirm your signup",
          html: `<b>Please confirm your signup with this code ${confirmationCode}</b>`
        })
          .then(info => res.render('message', { email }))
          .catch(error => console.log(error));
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/auth/confirm/:cCode", (req, res, next) => {
  res.render("auth/confirmation", { "message": req.flash("error") });
});



authRoutes.post("auth/confirmation", passport.authenticate("local", {
  //const email = req.body.email;
  //const cCode = req.body.confirmationCode;
  successRedirect: "/auth/login",
  failureRedirect: "/auth/confirmation",
  failureFlash: true,
  passReqToCallback: true
}));


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
