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
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode : token
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
    console.log(newUser)
  });

  //Send Email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  transporter.sendMail({
    from: `Elisa <${process.env.EMAIL}>`,
    to: email,
    subject: 'Confirm your email address',
    text: `Confirma tu correo en: http://localhost:3000/auth/confirm/${token}`,
    html:`<p>Confirma tu correo en http://localhost:3000/auth/confirm/${token}</p>`
  })
  .then(info => console.log('Email sent success'))
  .catch(error => console.log(error))
});

router.get('/confirm/:confirmCode',  (req, res) => {
  const {confirmCode} = req.params
  User.findOneAndUpdate({ confirmationCode: confirmCode }, { $set: { status: "Active" } }, { new: true })
  .then((data) => {
    res.render('auth/confirmation', data)
  })
  .catch(err => res.send(err))
});

router.get("/profile/:id", (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .then(user => {
      res.render("auth/profile", user);
    })
    .catch(err => {
      res.render("auth/profile", err);
    });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;