//#region setup
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

//#endregion

//#region utility functions
function getHashedWord(word) {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  return bcrypt.hashSync(word, salt);
}

function deleteSlashFromString(string) {
  return string
    .split("")
    .filter(elem => elem !== "/")
    .join("");
}
//#endregion

//#region POST /login GET /login

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

//#endregion

//#region GET /signup POST /signup
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;

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
    let hashName = deleteSlashFromString(getHashedWord(username));

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: hashName,
      status: "Pending Confirmation"
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transporter
          .sendMail({
            from: `"My Awesome Project 👻" <${process.env.EMAIL}>`,
            to: email,
            subject: "Confirm your account at myawesomeproject.com",
            text: message,
            html: `<b>${message} <a href="http://localhost:3000/auth/confirm/${hashName}">Link</a></b>`
          })
          .then(info => res.render("message", { email, subject, message, info }))
          .catch(error => console.log(error));
        res.redirect("/");
      }
    });
  });
});

//#endregion

//#region confirmation
authRoutes.get("/confirm/:hashName", (req, res, next) => {
  User.findOne({ confirmationCode: req.params.hashName })
    .then(user => {
      User.findByIdAndUpdate(user._id, { status: "Active" }).then(updatedUser => {
        res.render("auth/confirmation");
      });
    })
    .catch(err => {
      console.log("err");
      res.redirect("/");
    });
});
//#endregion

//#region GET /logout
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//#endregion

module.exports = authRoutes;
