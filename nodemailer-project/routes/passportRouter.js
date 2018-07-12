const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");

const {GMAIL_USER, GMAIL_PASSWORD } = process.env;


router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;

  User.findOne({
    username
  }).then(user => {
    if (user !== null) {
      throw new Error("Username Already exists");
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashName = bcrypt.hashSync(username, salt).replace("/", "");
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashName,
      status: "Pending Confirmation"
    });

    newUser
      .save()
      .then(user => {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASSWORD
          }
        });

        transporter
          .sendMail({
            to: email,
            subject: "Confirm email",
            text: "Awesome Message",
            html: templates.templateExample(hashName)
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));

        res.redirect(`/`);
      })
      .catch(err => {
        res.render("passport/signup", {
          errorMessage: err.message
        });
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
    res.render("passport/confirm", user);
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/profile", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
