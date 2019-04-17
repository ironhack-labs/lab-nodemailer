const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

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
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ $or: [{username}, {password}] }, (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username or email already exists" });
      return;
    }

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let confirmationCode = '';
    for (let i = 0; i < 25; i++) {
        confirmationCode += characters[Math.floor(Math.random() * characters.length )];
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email, 
      confirmationCode,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      let subject = 'Please, confirm your email';
      let message = `To activate your account, please follow the next link: <a href="http://localhost:3000/auth/confirm/${confirmationCode}">http://localhost:3000/auth/confirm/${confirmationCode}</a>`;
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'madwebmar19@gmail.com',
          pass: 'iron2019'
        }
      });
      transporter.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: subject, 
        text: message,
        html: message
      })
      .then(info => res.render('message', {email, subject, message, info}))
      .catch(error => console.log(error));
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

router.get('/confirm/:confirmationCode', (req, res, next) => {
  res.json({hola:'hola'});
});

module.exports = router;
