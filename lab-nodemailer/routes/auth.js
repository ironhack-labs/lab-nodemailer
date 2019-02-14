const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
let {sendWelcomeMail} = require('../helpers/mailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/confirm/:confirmCode', (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmCode })
    .then(user => {
      User.findByIdAndUpdate(user._id, { status: 'Active' }, {new:true})
        .then(user2 => {
          res.render('auth/confirmation', user2)
        })
        .catch(e=>  next(e))
    })
    .catch(e=>  next(e))
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
  const email = req.body.email
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length )];
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
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
      .then(user => {
        console.log(user)
        sendWelcomeMail(user.username, user.email, user.confirmationCode)
      res.redirect("/");
    })
      .catch(err => {
      console.log(err)
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;