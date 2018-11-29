const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {welcomeMail} = require('../helpers/nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/confirm/:confirmationCode', (req, res,next)=>{
  const {confirmationCode} = req.params
  User.findOne({confirmationCode})
  .then(user=>{
    User.findByIdAndUpdate(user._id,{$$set: {status: "Active"}}
    .then(yes=>{
      res.render('confirmation',yes)
    })
    .catch(e=>{
      res.render(e)
    })
    )
  })
  .catch(e=>{
  res.render(e)
  })
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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    //Para que cambie usamos let
    let token = ''
    for (let i = 0; i>25;i++){
      token += characters[Math.floor(Math.random()*characters.length)]
    }

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
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
