require('dotenv').config();

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
let {sendActivationMail} = require("../helpers/mailers")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


let generateToken = () =>{ 
  let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }
  return token
}


router.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmCode = req.params.confirmCode
  User.findOneAndUpdate({confirmationCode:confirmCode},{status:Active})
  .then(r=>res.render("auth/confirmation"))
  .catch(e=>res.send("Something went wrong "+ e))
})


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
  const username = req.body.username;
  const email = req.body.email;
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
    let confirmationCode = generateToken()

    const newUser = new User({
      username,
      email,
      confirmationCode,  
      password: hashPass,
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
      sendActivationMail(username,email,confirmationCode)
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
