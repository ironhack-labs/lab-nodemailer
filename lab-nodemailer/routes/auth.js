const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const { createToken } = require('../controllers/token.controller')
const { sendEmail } = require('../controllers/index.controller')


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const { username, password, email} = req.body

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username and password and email"
    });
    return;
  }
  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: createToken()
    });

    newUser.save()
      .then(() => {
        sendEmail(newUser.username, newUser.email, newUser.confirmationCode)
          .then(() => res.redirect("/"))
          .catch(err => console.log(err))
      })
      .catch(err => {
        res.render("auth/signup", {message: "Something went wrong"});
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  const { confirmCode } = req.params
  User.findOne({ confirmationCode: confirmCode })
    .then(user => {
      if(user) {
        user.status = 'Active'
        res.render('auth/profile.hbs', user)
      } res.render("auth/signup", { message: "Something went wrong" });
    })
    .catch(err => console.log(err))
})

module.exports = router;