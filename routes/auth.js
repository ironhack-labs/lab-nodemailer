const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const nodemailer = require('../config/nodemailer.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post('/login', (req, res, next) => {
  const username = req.body.username

  User.findOne({ username }, 'status', (err, user) => {
    if (user.status === 'Active') {
      res.render('auth/profile', {
        status: user.status,
        username
      })
      return
    } else {
      res.render('auth/login', { message: 'Please activate your account' })
      return
    }
  })
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  const { username, password, email, confirmationCode } = req.body

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
      .then(() => {
        nodemailer.sendValidationEmail(
          newUser.username,
          newUser.email,
          newUser.confirmationCode
        )
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

router.get('/confirm/:confirmationCode', (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmationCode }).then(
    (user) => {
      if (user) {
        user.status = 'Active'
        user
          .save()
          .then((user) => {
            res.render('auth/confirm', {
              message: 'Your account has been activated, log in below'
            })
          })
          .catch((error) => next)
      } else {
        res.render('/', {
          error: {
            validation: {
              message: 'invalid link'
            }
          }
        })
      }
    }
  )
})

module.exports = router;
