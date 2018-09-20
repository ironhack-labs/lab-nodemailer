const express = require("express");
const passport = require('passport');
const hbs= require('handlerbar');
const sendMail = require('../email/send');
const router = express.Router();
const User = require("../models/User");
const fileSystem = require('fs');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfi = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfi

    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .then(()=>{
      let templateStr = fileSystem.readFileSync('./email/templates/signup.hbs').toString();
      let template = hbs.compile(templateStr);
      let html = template({opinion:texto})
      console.log(html);
      sendMail(`${email}`,'Nueva opinión',html);
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

module.exports = router;
