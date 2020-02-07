const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {confirmAccount} = require('../config/nodemailer')
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
  const {username, email, password} = req.body;
  

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }

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

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: token
    });

    newUser.save()
    .then(confirmAccount(
      email,
      `http://localhost:3000/confirm/${token}`
    ))
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirmation', (req, res, next) => {
  res.render('auth/confirmation');
});

router.get('/confirm/:token', async (req, res, next) => {
  const {token}=req.params;
  const user = await User.findOneAndUpdate({confirmationCode: token}, {status: 'Active'},{new: true})
  res.redirect('/auth/confimation')
})

router.get('/profile', (req, res) =>{
  res.render('auth/profile', req.user)
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
