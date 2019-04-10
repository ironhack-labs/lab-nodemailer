const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const nodemailer = require('nodemailer');

// nodemailer settings
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

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
  const email   = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("aut,;h/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode:token
    });

      let message = `<center>
  <img src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4017/s300/logo-ironhack-blue.png" alt="ironhack_logo">
  <h1>Ironhack Confirmation Email</h1>
  <br>
  <h2>Hello ${username}!</h2>
  <br>
  <p>Thanks to join our community ! Please confirm your account clicking on the following link:</p>
  <br>
  <p>${process.env.BASE_URL}/auth/confirm/${token}</p>
  <h2>Great to see you creating awesome webpages with us!</h2>
</center>`

    newUser.save()
    .then(() => {
      transporter.sendMail({
        from: '"Kali" <whybutnot@gmail.com>',
        to: email, 
        subject: 'Validate your account', 
        text: message,
        html: `<b>${message}</b>`
      })
      .then(() => {
        res.redirect("/auth/signup-done");
      })
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/signup-done", (req, res, next) => {
  res.render("auth/signup-done");
});


router.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmationCode },
    { status: 'Active'}
    ) 
    .then(user => {
      if (user) {
        
        req.logIn(user, () => {
        res.render("auth/confirmation-success", {user,
        isConnectedAndActive: true 
          })
        })
      }
      else res.render("auth/confirmation-failed");
    })
  .catch(err => next(err))
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
