const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
//const sendConfEmail = require('../handlers/nodemailer')

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
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" }); //: sendConfEmail(email, token)
    return;
}

User.findOne({ username }, "username", (err, user) => {
  if (user !== null) {
    res.render("auth/signup", { message: "The username already exists" });
    return;
  }
  
})

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);
const email = req.body.email;
const status = req.body.status;
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
token += characters[Math.floor(Math.random() * characters.length )];
}

    const newUser = new User({
      email,
      username,
      status,
      password: hashPass, 
      confirmationCode: token
    });

    newUser
    .save()
    .then((newUser) => {
      res.redirect("/");
      console.log(newUser)
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  })


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
