const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendEmail = require('../mailing/sendMail');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  if (username === "" || password === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt)
    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashConfirmation,
      email
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendEmail(newUser.username, newUser.email, encodeURIComponent(newUser.confirmationCode));
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:hash", (req, res) => {
  const hashResponse = decodeURIComponent(req.params.hash);
  console.log('params', hashResponse);
  User.findOne({confirmationCode: hashResponse}, "confirmationCode", (err, user)=>{
    console.log('user', user);
    if(user == null){
      res.render('auth/signup',  { message: "There isn't a User associated with this account" });
    }
    User.findByIdAndUpdate(user.id, {status: "Active"})
      .then(user=>{
        console.log(`User ${user.name} has been activated`);
        res.render('auth/confirmation', {user});
      })
      .catch(e=>{console.log(e)});
  });
});

module.exports = authRoutes;
