const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const mailer = require("../config/nodemailer.config");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    message: req.flash("error")
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);



router.get("/profile", (req, res, next) => {
  res.render("auth/profile", {user : req.user});
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne(
    {
      username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          message: "The username already exists"
        });
        return;
      }
      const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let token = "";
      for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        email,
        confirmationCode: token
      });

      newUser
        .save()
        .then(x => {
          mailer.sendMail({
            from: '"Ironhacker Email 👻" <myawesome@project.com>',
            to: email,
            subject: "Hello, merluzo",
            text: `Hola ${username} esta es tu confirmación: http://localhost:3000/auth/confirm/${token}`,
            html: `<b>http://localhost:3000/auth/confirm/${token}</b>`
          });
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
          res.render("auth/signup", {
            message: "Something went wrong"
          });
        });
    }
  );
});

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {status :"Active"})
  .then(res.render('auth/confirmation'))
  .catch(err => console.log('error""', err))
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
