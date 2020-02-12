const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')
const mailer = require('../configs/nodemailer.config')



// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});


//nodemailer


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
      confirmationCode
    });

    newUser.save()
      .then((user) => {
        console.log(user)
        res.redirect("/");
      })

      .catch(err => {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong" });
      })
    let mns = `http://localhost:3000/auth/confirm/${confirmationCode}`
    mailer.sendMail({

      from: '"Ironhacker Email 👻" <myawesome@project.com>',
      to: email,
      text: mns,
      html: mns
    })
      .then(info => res.render('email-sent', { email, mns }))
      .catch(error => console.log(error));

  });
});

router.post('/auth/confirm/:confirmCode', (req, res, next) => {
  const confirm = req.params.confirmCode

  User.findOneAndUpdate(confirm, { status: 'Active' })
    .then(x => console.log('Holaaaaa'))
    .catch(error => console.log(error));
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

module.exports = router
