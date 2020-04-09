const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require('connect-ensure-login');
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/private-page",
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
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }

  const confirmationCode = token;


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
      email,
      password: hashPass, 
      confirmationCode,
    });

    newUser.save()
    .then(user => {

      transport.sendMail({
        from: '"Nodemailer " <myawesome@project.com>',
        to: user.email, 
        subject: 'Testing Nodemailer', 
        text: `http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        html: '<b>Awesome Message</b>'
      })
      .then(info => {
        console.log(info);
        res.redirect("/auth/login");
        })  
      .catch(error => console.log(error))
      
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  const {
    confirmCode
  } = req.params

  User.findOneAndUpdate({confirmationCode: confirmCode}, {$set: {status: 'Active'}})
      .then(user => {
        console.log(user);
        user.status = "Active"; 
        res.render('confirmation', {user})
      })
      .catch(error => console.log(error))
})

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  console.log(req.user);
  
  res.render('private-page', {user: req.user});
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
