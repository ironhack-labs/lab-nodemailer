require('dotenv').config();
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
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
    const usernameHass = bcrypt.hashSync(username, salt);
    const confirmatCode= usernameHass.replace('/','');

   

    const newUser = new User({

      username: username,
      password: hashPass,
      status: "Pending Confirmation",
      confirmationCode: confirmatCode,
      email: email

    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      } else {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.mail,
            pass: process.env.password
          }
        });
        transporter.sendMail({

            from: process.env.mail,
            to: process.env.mail,
            subject: "Create your account!!",
            text: "mensaje",
            html: `<a href='http://localhost:3000/auth/confirm/${confirmatCode}'>Confirma</a>`
          })
          .then(info => res.redirect("/"))
          .catch(error => console.log(error));




      }
    });
  });
});


authRoutes.get('/confirm/:confirmationCode', (req, res, next) => {
  console.log("sdfsdfsdsdfsd")
  const {confirmationCode} = req.params;

  User.findOne({confirmationCode})
  .then(user => {
    return User.findByIdAndUpdate(user._id, {status: 'Active'})
  })
  .then(user => {
    res.render('auth/confirmation');
  })
  .catch(err => next(err.message))
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;