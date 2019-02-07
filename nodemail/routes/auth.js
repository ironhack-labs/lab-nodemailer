const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

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
  const email    = req.body.email;
  const confirmationCode = `${Math.random()}`;

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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
    });

  newUser
      .save()
      .then(user => {
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "pruebanodemailer0119@gmail.com",
            pass: "Prueba-nodemailer-0119"
          }
        });

         transporter
          .sendMail({
            from: '"Confirm User" <myawesome@project.com>',
            to: user.email,
            subject: "Confirm your Sign Up 🤘",
            html: `<b>http://localhost:3000/auth/confirm/${
              user.confirmationCode
            }</b>`
          })
          .then(info => console.log('email sent OK'))
          .catch(error => console.log(error));
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:code", (req, res, next) => {
  User.findOne({ confirmationCode: req.params.code }).then(user => {
    if (user !== null) {
      User.findByIdAndUpdate(user._id, { status: "Active" }).then(user =>
        res.redirect("/confirmation")
      );
      return;
    }
    res.redirect("/auth/signup");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
