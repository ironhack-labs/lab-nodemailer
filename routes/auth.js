const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../mail/mail");
const hbs = require("handlebars");
const fs = require("fs");

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
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const confirmationCode = bcrypt.hashSync(username, salt);
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });
    let sub = "Confirmation Mail";
    const templateStr = fs.readFileSync("./mail/template/mail.hbs").toString();
    const template = hbs.compile(templateStr);
    const html = template({ confirmationCode, username });
    newUser
      .save()
      .then(() => {
        return sendMail(email, sub, html);
      })
      .then(() => {
        res.redirect("/");
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

router.get("/confirmation/:confirmCode", (req, res) => {
  console.log(req.params.confirmCode);
  const confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode: confirmCode }, { status: "Active" })
    .then(user => {
      console.log(user);
      res.render("auth/confirmation", { user });
    })
    .catch(e => console.log(e));
});
module.exports = router;
