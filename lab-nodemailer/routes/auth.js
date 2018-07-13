const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const transporter = require("../mail/transporter");
const nodemailer = require('nodemailer')

require('dotenv').config();
const {USER, PASS} = process.env

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email, confirmationCode, status} = req.body;

  User.findOne({
    username
  }).then(user => {
    console.log(user);
    if (user !== null) {
      throw new Error("Username Already exists");
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashName = bcrypt.hashSync(username, salt);


    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashName,
      status: "Pending Confirmation",
    });

    newUser.save(err => {
      if (err) {
        res.remder("auth/signup", { message: "something went wrong" });
      } else {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: USER,
            pass: PASS
          }
        });
        transporter
          .sendMail({
            from:"tua madre",
            to: email,
            subject: 'subject',
            text: "message",
            html: `<b>http://localhost:3000/auth/confirm/${hashName}</b>`
          })
          .then(user => {
            res.redirect("/check");
          })
          .catch(err => {
            res.render("auth/signup", { errorMessage: err.message });
          });
      }
    });
  });
});

router.get("/confirm/:id", (req, res, next) => {
    console.log(req.params);
    User.findOneAndUpdate(
      { confirmationCode: req.params.id },
      { status: "Active" },
      { new: true }
    ).then(user => {
      res.render("auth/confirm", user);
    });
  });

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/singleUser",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
