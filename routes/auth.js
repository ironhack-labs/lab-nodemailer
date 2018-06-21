const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

const message = "Please confirm your account! Click on the link.";

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

function getHashedWord(word) {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  return bcrypt.hashSync(word, salt);
}

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log("SIGNUP POST EMAIL", email);
  const rol = req.body.role;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const hashPass = getHashedWord(password);
    let hashName = getHashedWord(username);
    hashName = hashName
      .split("")
      .filter(elem => elem !== "/")
      .join("");

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: hashName,
      status: "Pending Confirmation"
    });

    // function sendMail() {}

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        // transporter
        //   .sendMail({
        //     from: '"My Awesome Project 👻" <myawesome@project.com>',
        //     to: email,
        //     subject: subject,
        //     text: message,
        //     html: `<b>${message} <a href="http://localhost:3000/auth/confirm/${hashName}">Link</a></b>`
        //   })
        //   .then(info => res.render("message", { email, subject, message, info }))
        //   .catch(error => console.log(error));
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/confirm/:hashName", (req, res, next) => {
  console.log("CONFIRM: ", req.params.hashName);
  User.findOne({ confirmationCode: req.params.hashName })
    .then(user => {
      console.log("USER: ", user);
      User.findByIdAndUpdate(user._id, { status: "Active" }).then(updatedUser => {
        console.log("UPDATED USER", updatedUser);
        res.redirect("/auth/login");
      });
    })
    .catch(err => {
      console.log("err");
      res.redirect("/");
    });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
