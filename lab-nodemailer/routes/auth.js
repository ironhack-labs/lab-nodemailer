const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const transporter = require('../mail/trasnporter');


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
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email!!!" });
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
      confirmationCode
    });

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })

    const mail = req.body.email;
    transporter.sendMail({
      from: '"My Awesome Project 👻" <myawesome@project.com>',
      to: '',
      subject: 'Prueba',
      text: 'http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER',      
    })
      .then(() => res.render('message', { mail, subject, message }))
      .catch(err => console.log(err));

  });


});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post('/send-email', (req, res, next) => {
  const { email, subject, message } = req.body;
  transporter.sendMail({
    from: '',
    to: '',
    subject: 'miau',
    text: 'miau',
    html: 'Miau',
  })
    .then(() => res.render('message', { email, subject, message }))
    .catch(err => console.log(err));
});






module.exports = router;