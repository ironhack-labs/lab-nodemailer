const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

require('dotenv').config();
const nodemailer = require('nodemailer');

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;

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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: token
    });

    newUser.save()
      .then(() => {
        const mail = process.env.MAIL;
        const pass = process.env.PASS;

        const transport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: mail,
            pass: pass
          }
        })

        const to = 'XXX0@gmail.com';
        const activationURL = `http://localhost:3000/auth/confirm/${token}`;
        transport.sendMail({
          to: email,
          from: 'XXX',
          subject: 'Account activation',
          html: `
          <h3>Hello ${username}!</h3>
          <p>Thanks for joining our community! Please confirm your account by clicking on the following link:</p>
          <br>
          <a href="${activationURL}">${activationURL}</a>
          `
        })

        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  const { confirmCode } = req.params;
  console.log(confirmCode);

  User.findOne({ confirmationCode: confirmCode })
  .then(user => {
    if (user) {
      user.status = "Active";
      user.save()
        .then(() => res.render('confirmation', { user }))
        .catch(() => res.render('auth/signup', { message: 'Oh noo, something went wrong with the account activation.' }))
    } 
  })
  .catch(err => console.log(err));
  
})

router.get('/profile', (req, res, next) => {
  User.findById(req.session.passport.user)
    .then(userFound => {
      res.render('profile', { userFound })
    })
    .catch(err => console.log(err));
})

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
