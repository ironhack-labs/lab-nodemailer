const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendWelcomeMail = require('../helpers/nodemailer').sendWelcomeMail;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
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
    let confirmationCode = bcrypt.hashSync(username, salt);
    let confirmationCodeArr = confirmationCode.split("/");
    confirmationCode = confirmationCodeArr.join('');

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendWelcomeMail(newUser);
        res.redirect('/login');
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:confirmCode", (req, res, next)=>{
  const confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({confirmationCode: confirmCode}, {$set:{status:"Active"}}, {new: true})
    .then(update=>{
      res.render('confirmation', update);
    })
    .catch(e=>next(e));
});

authRoutes.get('/profile', (req,res)=>{
  let user = req.user;
  res.render('profile', user);
});

module.exports = authRoutes;
