const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// Multer
const multer  = require('multer');
const uploadCloud = require('../config/cloudinary.js');


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

router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {
  const { username, email, password } = req.body;
  if (username === "" || password === "" || email === '') {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
  // User.findOne({ email }, "email", (err, user) => {
  //   if (email !== null) {
  //     res.render("auth/signup", { message: "The email already exists" });
  //     return;
  //   }

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
      confirmationCode: token,
      email,
      path: req.file.url,
      originalName: req.file.originalname
    });

    newUser.save()
    .then(user => {
      console.log('User created ==>' + user);
      transporter.sendMail({
        from: '"From Lab Nodemailer" <noreply@ironhack.com>',
        to: user.email, 
        subject: 'Welcome to Lab Nodemailer', 
        text: `http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        html: `
        <h1>Hello, ${user.username}!</h1>
        <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">Confirm your email</a>`
      })
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

router.get('/confirm/:confirmCode', (req, res) => {
  const token = req.params.confirmCode;

  User.findOneAndUpdate({ confirmationCode: token }, { status: 'Active' }, { new: true })
  .then(user => {
    res.render('auth/confirmation', { user });
  })
  .catch(() => {
    res.render('auth/confirmation', { message: 'Something went wrong' })
  })
});



module.exports = router;
