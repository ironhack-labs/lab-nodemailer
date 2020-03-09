const express = require("express");
const passport = require("passport");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const { email, username, password } = req.body;
  const confirmationCode = token;

  if (email === "" || username === "" || password === "") {
    res.render("auth/signup", {
      message: "Please indicate an email, username and password."
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
      email,
      confirmationCode
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });

    // Nodemailer sending email
    let transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: "kmedinakm@hotmail.com",
        pass: process.env.PASSWORD
      }
    });
    transporter
      .sendMail({
        from: '"My awesome project" <myawesome@project.com>',
        to: email,
        subject: "Nodemailer Test",
        text: "Awesome Message",
        html: `
        Ironhack Confirmation Email <br>
        Hello ${username}! <br>
        Please confirm your account by clicking on the following link: <br>
        <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Verify your email</a>
        `
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(err =>
        console.log(`Error occured while sending an email: ${err}`)
      );
  });
});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  let confirmCode = req.params.confirmationCode;
  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { status: "Active" }
  ).then(() => {
    res.render("profile");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
