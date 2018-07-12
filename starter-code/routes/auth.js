const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendMail = require ("../mailer/sendMail")
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
    const confirmationCode = encodeURI(hashPass).replace(/["/"]/g,"")+username
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    })
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        req.user = newUser
        res.render("checkMail");
      }
    });
    const link = `http://localhost:3000/auth/confirm/${confirmationCode}`
    
    sendMail(email,"../views/toSend.hbs",{username,link})
    
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:code", (req, res) => {
  User.findOne({confirmationCode:req.params.code})
  .then(user=>{
    console.log("founded!!")
    User.findByIdAndUpdate(user._id,{status:"Active"})
    .then(u=>{
      console.log("updated!!")
      res.redirect("/auth/login");

    })
    .catch(err=>{
      console.log(err)

    })
  })
  .catch(err=>{
    console.log(err)
  })
  
});

module.exports = authRoutes;
