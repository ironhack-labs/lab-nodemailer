const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const transporter = require("./../configs/nodemailer.config");
const loginMid = require("./../middlewares/login.mid");
// const nodemailerTemplate = require("./../templates/confirm.nodemailer")

const randToken = require("rand-token");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post("/login", [
  loginMid.loginWithPendingAccount,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
]);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

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

    const confirmationCode = randToken.generate(64);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode,
      email
    });

    newUser
      .save()
      .then(() => {
        transporter
          .sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: "Subject test",
            text: "Text test",
            html: `
          
            <div style="max-width: 400px;
              margin: 2rem auto;
              padding: 2rem;
              background-color: #F8F8F8;
              font-family: sans-serif;
              box-shadow: 0 3px 6px rgba(0, 0, 0, .15)">

              <h1 style="color: crimson;
                margin-bottom: 32px;">Verify your user</h1>

              <p style="color: #888888;
                font-family: sans-serif;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 1rem;">We need you to verify your account so you can log in in our website.</p>

              <a style="display: inline-block;
                font-family: sans-serif;
                padding: .5rem 1rem;
                border-radius: 3px;
                box-shadow: 0 3px 6px crimson;
                background-color: crimson;
                color: #FFFFFF;
                text-decoration: none;
                text-transform: uppercase;
                font-size: 14px;" href="http://localhost:3000/auth/confirm/${confirmationCode}">Activate account</a>
            </div>
            `
          })
          .then(emailSent => {
            res.redirect("/");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:token", loginMid.accountActivated, (req, res, next) => {
  console.log("Let's update");
  User.updateOne(
    { confirmationCode: req.params.token },
    { status: "Active" },
    { new: true }
  ).then(accountActivated => {
    res.redirect("/auth/account-activated");
    return;
  });
});

router.get("/account-activated", (req, res, next) => {
  res.render("auth/account-activated");
});

router.get("/account-already-activated", (req, res, next) => {
  res.render("auth/account-already-activated");
});

router.get("/confirm-your-email", (req, res, next) => {
  res.render("auth/confirm-your-email");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
