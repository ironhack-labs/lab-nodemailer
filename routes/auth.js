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
  successRedirect: "/profile",
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
      let text = `Ironhack Confirmation Email\nHello ${username}!\nThanks to join our community! Please confirm your account clicking on the following link:\nhttp://localhost:3000/auth/confirm/${confirmationCode}\nGreat to see you creating awesome webpages you with us! 😎`;
      let message = `
      <div style="text-align:center;">
        <h1>Ironhack Confirmation Email</h1>
        <h2>Hello ${username}!</h2>
        <p>Thanks to join our community! Please confirm your account clicking on the following link:</p>
        <a style="display:block;" href="http://localhost:3000/auth/confirm/${confirmationCode}">http://localhost:3000/auth/confirm/${confirmationCode}</a>
        <p><strong>Great to see you creating awesome webpages you with us! 😎</strong></p>
      </div>
      `;
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
        text: text,
        html: message,
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(error => console.log(error));
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", { message: "Something went wrong" });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmationCode', (req, res, next) => {
  User.findOne({confirmationCode: req.params.confirmationCode})
    .then((user) => {
      if(!user) return res.render('auth/confirmation', {activated: false});

      return Promise.resolve(user);
    })
    .then(user => User.findByIdAndUpdate(user._id, {
        confirmationCode: '',
        status: 'Active',
    }))
    .then(() => {
      res.render('auth/confirmation', {activated: true});
    })
    .catch(err => console.error(err));
});

module.exports = router;
