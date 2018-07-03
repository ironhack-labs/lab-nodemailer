const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (validateEmail(email) === false){
    res.render("auth/signup", { message: "Please ender a valid email" });
    return;
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass
      }
    });

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const code = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: code,
      status: 'Pending Confirmation'
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Error in saving new User" });
        console.log(err);
      } else {
        transporter.sendMail({
          from: "'Lab-Nodemailer is working' ${process.env.user}",
          to: newUser.email,
          subject: 'Confirmation Code',
          text: 'Thanks for subscribing!',
          html: `<b>Click here to confirm your account: <a href='http://localhost:3000/auth/confirm?code=${newUser.confirmationCode}'>Rainbows</a></b>`
        })
        .then(info => res.redirect("/"))
        .catch(err => console.log(err));
      }
    });
  });
});

authRoutes.get('/confirm', (req, res, next) => {
  // res.send('req')
  User.findOneAndUpdate({'confirmationCode': req.query.code}, {status: 'Active'})
    .then(user => {
      res.render('auth/confirmation', {user});
      console.log(user);
    })
    .catch(err => {
      console.log('Confirmation unauthenticated, work harder: ', err);
      next();
    });
});

authRoutes.get('/profile/:id', (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then(user => {
      res.render('profile', {user});
      console.log(user);
    })
    .catch(err => {
      console.log('Profile unwanted to be shown: ', err);
      next();
    });
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
