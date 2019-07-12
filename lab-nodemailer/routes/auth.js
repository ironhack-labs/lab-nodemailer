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

router.get("/profile", (req, res, next) => {
  const user = req.user
  console.log(user)
  res.render("auth/profile", {user} );
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
  const username = req.body.username;
  const password = req.body.password;
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


    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let cCode = '';
    for (let i = 0; i < 25; i++) {
      cCode += characters[Math.floor(Math.random() * characters.length)];
    }
    console.log(cCode)
    console.log(username)

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: cCode,
      email,
    });
    console.log(newUser)

    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.PASSUSER
      }
    });

    transporter.sendMail({
      from: '"My Awesome Project 👻" <36c13ad0de-e209b3@inbox.mailtrap.io>',
      to: email,
      subject: 'Awesome Subject',
      text: 'Awesome Message',
      html: `<a href="http://localhost:3000/auth/confirm/${cCode}">Confirmation Code</a>`
    })
      .then(info => console.log(info))
      .catch(error => console.log(error))

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  const confirmCode = req.params.confirmCode
  User.findOne({ "confirmationCode": confirmCode },(err, user) => {
    if (user === null) {
      res.send('You dont have a confirmation code')
    }
    User.update({status:'Active'})
      .then(() => {
        res.render('auth/confirmation')
      })
      .catch((err) => console.log(err))
  })
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
