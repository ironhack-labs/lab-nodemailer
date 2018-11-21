const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

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
  const message = "Please confirm your email by following this link: "
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate email, username and password" });
    return;
  }
  if (username === password) {
    res.render("auth/signup", { message: "Weak password" })
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      status: "Pending Confirmation",
      confirmationCode: hashCode,
      email: email,
    });

    newUser.save()
      .then(() => {


        User.find({ username: username })
          .then(user => {
            transporter.sendMail({
              from: '"My Awesome Project 👻" <charlottetreuse42@gmail.com>',
              to: email,
              subject: "Confirm your email",
              text: message,
              html: '<b>' + username + '<br>' + message + '<a href="http://localhost:3000/auth/confirm/' + user[0]._id + '">' + 'link' + '</a>' + '</b>'
            })
              .then(info => res.render('message', { email: email }))
              .catch(error => console.log(error))
          })
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });

});

router.get('/confirm/:id', (req, res, next) => {
  let id = req.params.id
  User.findByIdAndUpdate(id, { status: "Active" })
    .then(user => {
      res.render('confirmed-email', { user: user })
    })
    .catch(err => { console.log(err), res.render('confirmed-failed') })
})

router.get("/user/:id", (req, res, next) => {
  let id = req.params.id
  User.findById(id)
    .then(user => { res.render('profile', { user: user }) })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
