const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')
// const transporter = require('../mail/*')
const urlencode = require('urlencode')

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
  const username = req.body.username;
  const email = req.body.email
  const password = req.body.password;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt)

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: hashConfirmation
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
        //TODO enviar mail

        let urlConfirmation = urlencode(hashConfirmation)

        let subject = 'SIGNUP DEL GUENO'
        let message = `<a href="http://localhost:3000/auth/confirm/${urlConfirmation}">Validate account</a>`


        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });
        transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: subject,
          html: `<b>${message}</b>`
        })
        .then(console.log('mail sent'))
        .catch(error => console.log(error));
      }
    });
  });
});



authRoutes.get('/confirm/:id', (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: urlencode.decode(req.params.id)}, {status: 'Active'})
  .then(() => {
    console.log('si')
    res.render('auth/confirm', {status: 'ok'})
  })
  .catch(() => {
    console.log('no')
    res.render('auth/confirm', {status: 'ko'})
  })
})



authRoutes.get('/profile/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    res.render('auth/profile', {user})
  })
})



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
