const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ensureLogin = require("connect-ensure-login");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: `${process.env.EMAIL_ADDRESS}`,
    pass: `${process.env.EMAIL_PASSWORD}`
  }
});

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

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// router.get("/profile", (req, res, next) => {
//   User.findById(req.user.id)
//   res.render("auth/profile");
// });

router.get(
  "/profile",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("auth/profile", { user: req.user });
  }
);

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
      .then(newUser => {
        transporter
          .sendMail({
            from: '"My Awesome Project 👻" <myawesome@project.com>',
            to: `${newUser.email}`,
            subject: `${newUser.username}, welcome to My Awsome Project`,
            text: "Awesome Message",
            html: `<b><a href="http://localhost:3000/auth/confirm/${newUser.confirmationCode}">Click here to validate your account</a></b>`
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.post("/send-email", (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render("message", { email, subject, message });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  const code = req.params.confirmCode;
  User.findOneAndUpdate(
    { confirmationCode: code },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(user => {
      if (user === null) {
        res.render("auth/activation", { user, error: true });
      }
      res.render("auth/activation", { user, ok: true });
    })
    .catch(() => {
      console.log(error);
    });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
