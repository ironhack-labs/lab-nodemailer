const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
    
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];}

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: token,
      email: email
    });

    let link = `http://localhost:3000/auth/confirm/${token}`

    let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'madwebmar19@gmail.com',
      pass: 'iron2019'
      }
    });

    transporter.sendMail({
    from: '"My Awesome Project 👻" <bill.gates@ironhack.com>',
    to: email, 
    subject: `Confirmation email`, 
    text: link,
    html: `<b>${link}</b>`
    })

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmCode = req.params.confirmCode;

  Promise.resolve()
  .then(() => User.findOneAndUpdate({confirmCode: confirmCode}, {status: "Active"}))
  .then(() => res.redirect("/"))
  .catch((err) => console.log(err))
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
