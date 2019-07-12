const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
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
  const { username, password, email, status } = req.body;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    // Create confirmation Token
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2b3824c55c8b31",
        pass: "586517166fb2d9"
      }
    });
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = token;
    const newUser = new User({
      username,
      password: hashPass,
      status,
      confirmationCode,
      email
    });
    console.log(newUser);

    newUser.save()
      .then(() => {
        res.redirect("/");
        transporter.sendMail({
          from: '"Web Signup" <8bd9774042-b1217e@inbox.mailtrap.io>',
          to: email,
          subject: 'Signup Confirmation',
          text: 'Click below to confirm your registration: ',
          html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Click here! =)</a>`
        })
          .then(info => console.log(info))
          .catch(error => console.log(error))
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  const confirmationCode = req.params.confirmationCode;
  const status = 'Active';

  console.log(confirmationCode);

  User.findOneAndUpdate({ confirmationCode: confirmationCode }, { $set: { status } })
    .then(() => res.render('auth/confirm'))
    .catch(err => console.log(err))
})
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;
