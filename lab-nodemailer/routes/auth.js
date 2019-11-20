const express = require("express");
const passport = require('passport');
const router = express.Router();
const transporter = require('../config/nodemailer.config')
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const confirmationCode = Math.random().toString(36).slice(2);


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate all fields"
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
      const bcryptSalt = 3;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      // const hashConf = bcrypt.hashSync(confirmationCode, salt);

      const newUser = new User({
        username,
        email,
        password: hashPass,
        confirmationCode,
      });

      newUser.save()
        .then(() => {
          transporter.sendMail({
            from: '"My Nodemailer Project" <myawesome@project.com>',
            to: email,
            subject: 'Welcome buddy!',
            text: `Hello ${username}, please confirm your account here: http://localhost:3000/auth/confirm/${confirmationCode}`,
            html: `<b>Hello ${username}, please confirm your account here: http://localhost:3000/auth/confirm/${confirmationCode}</b>`
          })
        });

      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", {
        message: "Something went wrong"
      });
    })
});

router.get("/confirm/:confirmCode", (req, res) => {
  User.updateOne({
      confirmationCode: req.params.confirmCode
  }, {
    status: "Active"
  }).then(() => res.render("auth/confirmation"))
  .catch(err => {
    res.render("auth/signup", {
      message: "Something went wrong"
    });
  })
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;