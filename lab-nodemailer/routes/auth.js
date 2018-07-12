const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendMail = require("../mailing")

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
  const {username, password, email} = req.body;

  if (username === "" || password === "" || email === "") {
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
    
    const hashUser = bcrypt.hashSync(username, salt);
    const confirmationCode = hashUser.replace('/', '');

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode,
      email,
    });

    newUser.save()
    .then(() => {
      return sendMail(newUser)
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => console.log(err)) // res.render("auth/signup", { message: err })
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get('/confirm/:confirmationCode', (req, res, next) => {
  const {confirmationCode} = req.params;

  User.findOne({confirmationCode})
  .then(user => {
    return User.findByIdAndUpdate(user._id, {status: 'Active'})
  })
  .then(user => {
    res.render('auth/confirmation', {user});
  })
  .catch(err => next(err.message))
})

module.exports = authRoutes;
