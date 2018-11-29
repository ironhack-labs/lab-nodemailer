const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../email/sendmail");

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

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    User.create({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    })
      .then(user => {
        sendMail(user.email, "authentication", user.confirmationCode);
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:code", (req, res, next) => {
  const code = req.params.code;
  User.findOneAndUpdate({ confirmationCode: code }, { status: "Active" }).then(
    () => res.redirect("/")
  ).catch(()=>res.render("/auth/signup",{message:"Error"}));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
