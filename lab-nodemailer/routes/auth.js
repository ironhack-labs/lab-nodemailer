require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const status = req.body.status;
  const confirmationCode = makeConfirmationCode();
  // console.log("confirmationCode: "+confirmationCode)
  // console.log(email)
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
      status,
      confirmationCode
    });

    newUser
      .save()
      .then(() => {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL
          },
        });
        transporter.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: newUser.email,
          subject: "Awesome Subject",
          text: "TEXT",
          html: "http://localhost:3000/auth/confirm/"+newUser.confirmationCode
        });
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

function makeConfirmationCode() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}


router.get('/confirm/:confirmCode', (req, res)=> {
  console.log(req.params.confirmCode);
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, { $set: { status: 'Active' }}, {new:true})
  .then((confirmedUser) => {
    console.log(confirmedUser);
    res.render("confirmation", confirmedUser);
  });
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
