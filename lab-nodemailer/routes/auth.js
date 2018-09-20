const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../mail/sendMail');
const ensureLogin = require('connect-ensure-login');

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
    const hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      email,
      confirmationCode: hashUser,
      password: hashPass
    });

    newUser.save()
    .then((user) =>{
      sendMail(
        user.email,
        'Confirmation email',
        `Please confirme your account clicking the following link: <a href='http://localhost:3000/auth/confirm/${user.confirmationCode}'>HERE</a>`
      )

    })
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

router.get("/confirm/:confirmCode", ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  if (req.params.confirmCode == req.user.confirmationCode){
    User.findByIdAndUpdate(req.user._id, {status: 'Active'}).then(user => {
      return res.render('auth/confirmation.hbs', {user});
    })
  } else {
    res.render("auth/confirmation", { "message": 'Sorry, the confirmation code is not valid.' });

  }
});

router.get('/profile', ensureLogin.ensureLoggedIn('/auth/login'), (req, res) => {
  let user = req.user;
  res.render('auth/profile', {user});
})

module.exports = router;
