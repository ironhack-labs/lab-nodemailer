const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const checkPopino = require("../middleware/authentification ");
const sendMail = require("../email/sendMail");
// Bcrypt to encrypt passwords
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});
router.get("/welcome", checkPopino("/auth/login"), (req, res) =>
  res.render("auth/welcome")
);

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
  const confirmationCode = req.body.confirmationCode;
  if (
    username === "" ||
    password === "" ||
    email === "" ||
    confirmationCode === ""
  ) {
    res.render("auth/signup", { message: "Fill in all the camps" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null && email !== null) {
      res.render("auth/signup", {
        message: "The username/email already exists"
      });
      return;
    }

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      confirmationCode: token,
      password: hashPass
    });

    newUser
      .save()
      .then(user => {
        sendMail(user.username, user.email, user.confirmationCode);
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:code", (req, res, next) => {
  const pepe = req.params.code;
  User.findOneAndUpdate(
    { confirmationCode: pepe },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(x => res.redirect("/auth/welcome"))
    .catch(err => console.log(err));

  // User.findOneAndUpdate(req.params.code) == req.params.code;
});

router.get("/private", checkPopino("/auth/login"), (req, res) => {
  res.render("/auth/private");
});

module.exports = router;
