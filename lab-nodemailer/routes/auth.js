require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();
const transporter = require("../modules/nodemailer");
const template = require("../modules/email-template");
const htmlToText = require("html-to-text");
const checker = require("../middlewares/checker");
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Crypto
const crypto = require("crypto");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
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
    const confirmationCode = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser
      .save()
      .then(data => {
        const text = htmlToText.fromString(
          template.emailTemplate(confirmationCode, data),
          { wordwrap: 130 }
        );

        transporter
          .sendMail({
            from: `My Awesome Project 👻 ${process.env.NODEMAILER_USER}`,
            to: data.email,
            subject: "Email confirmation",
            text: text,
            html: template.emailTemplate(confirmationCode, data)
          })
          .then(() => {
            res.redirect("/");
          })
          .catch(error => console.log(error));
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res) => {
  const confirmCode = req.params.confirmCode;

  User.findOne({ confirmationCode: confirmCode })
    .then(user => {
      user.status = "Active";
      user.save();
      res.redirect("/auth/confirmation-success");
    })
    .catch(error => console.log(error));
});

router.get("/confirmation-success", (req, res) => {
  res.render("email/confirmation-success");
});

router.get("/profile", checker.checkStatus("Active"), (req, res) => {
  User.findById(req.user._id).then(user => {
    res.render("auth/profile", { user });
  });
});

module.exports = router;
