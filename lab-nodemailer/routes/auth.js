const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

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

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
  token += characters[Math.floor(Math.random() * characters.length )];
  }

  const confirmationCode = token;

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
      email: email,
      confirmationCode: confirmationCode,
    });

    newUser.save()
      .then(() => {
        const transporter = nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: '18e33551354c94',
            pass: 'f1ff2ec57b9da6',
          },
        });

        transporter.sendMail({
          from: '"Servo-Service 👻" <thatreal@service.com>',
          to: email,
          subject: 'Welcome to Servo-Service! Please confirm your account.',
          text: `
          Hi, there!
          Welcome to Servo-Service, the premier service for services!
          Please, click on the link below to confirm your account:
          http://localhost:3000/auth/confirm/${confirmationCode}`,
          html: `
          <h3>Hi, there!</h3>
          <p>Welcome to Servo-Service, the premier service for services!</p>
          <p>Please, click <a href="http://localhost:3000/auth/confirm/${confirmationCode}">here</a> to confirm your account.</p>`,
        })
          .then((info) => {
            console.log(info);
            res.redirect('/');
          })
          .catch(error => console.log(error));
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
