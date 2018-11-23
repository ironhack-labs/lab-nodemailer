const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const transporter = require('../mail/transporter');

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
  const email = req.body.mail;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length )];
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
      confirmationCode,
      email,

    });

    newUser.save()
    .then(() => {
      
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


router.post('/send-email', (req, res, next) => {
  const { email, subject, message } = req.body;
  transporter.sendMail({
    from: 'nfake6162@gmail.com',
    to: 'nfake6162@gmail.com',
    subject: 'Prueba',
    text: 'Hola',
    html: 'http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER',
  })
    .then(() => res.render('message', { email, subject, message }))
    .catch(err => console.log(err));
});


module.exports = router;

