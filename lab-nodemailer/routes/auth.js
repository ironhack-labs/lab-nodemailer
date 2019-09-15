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
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)]
    }
    const confirmationCode = token

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    })

    const bodyMail = `
    Please verify your account:
    <a href="http://localhost:${process.env.PORT}/user/verify/${confirmationCode}">
      http://localhost:${process.env.PORT}/user/verify/${confirmationCode}
    </a>`

    newUser.save()
    .then(() => {
      transporter.sendMail({
        from: '"Miss popofsky" <pixiepopofsky@gmail.com>',
        to: email,
        subject: 'Please confirm your account',
        text: bodyMail
      })
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

router.get("/verify/:confirmationCode", (req,res) => {
  res.render('verify/:confirmationCode')
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
