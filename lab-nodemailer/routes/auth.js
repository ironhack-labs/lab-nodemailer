const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const { sendMessageAck } = require("../config/mailer.config");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
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
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({$or:[{username: username},{email: email}]}, (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username or email already exists. Try to log-in or use a different one." });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email
    });

    User.create(newUser)
    .then(() => {
      User.findOne({username: req.body.username})
      .then((r) => {
        sendMessageAck(r.email, r.username, r.confirmationCode);
        res.render('index', {message: 'Account created! Check your e-mail to validate it.'});
      })
    })
  
  })
  .catch(err => {
  res.render("auth/signup", { message: "Something went wrong" });
  })
  
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:id", (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: req.params.id}, {status: 'active'})
  .then((r) => {
    res.render('auth/confirmation', {message_active: 'Account activated! Now you can log-in.'});
  })
});

router.get("/profile", (req, res) => {
  if (req.user) {
    res.render("auth/profile", {username: req.user.username, email: req.user.email});
  } else {
    res.redirect("./login")
  }
});


module.exports = router;
