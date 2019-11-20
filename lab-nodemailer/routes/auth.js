const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/User");
const characters =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let token = "";

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
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = token;

  if (username === "" || password === "" || email === "") {
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

    // NODEMAILER

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ironnodemailertest@gmail.com",
        pass: "G1g4n3t*"
      }
    });
    transporter
      .sendMail({
        from: '"My Awesome Project " <myawesome@project.com>',
        to: email,
        subject: "Please verify your registered email address",
        text: "Please verify your email address by clicking the link below",
        html: `<b>http://localhost:3000/auth/confirm/${confirmationCode}</b>`
      })
      .then(info => res.render("message", { email, confirmationCode }))
      .catch(error => console.log(error));
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res) => {
  let code = req.params.confirmationCode;
  console.log(code)

  User.find({ confirmationCode: code })
    .then(user => {
      // user[0].status = "Active";
      res.render("confirmation", user[0]);
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

module.exports = router;
