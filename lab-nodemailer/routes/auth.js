const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }


  
  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)]
    }

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token
    })

    newUser.save()
      .then(() => {

        let {email} = req.body;

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
          }
        })
   
        transporter.sendMail({
          from: '"Sofia" <sofia.jordan2000@gmail.com>',
          to: email,
          subject: 'HEY BITCH',
          // text: message,
          html: `<a href="http://localhost:3000/auth/confirm/${token}">Confirm account<a>`,   
        })

        res.redirect("/")
      })


      .catch(err => {
        console.log(err)
        res.render("auth/signup", {
          message: "Something went wrong"})
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



router.get("/confirm/:confirmationCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmationCode}, {$set: {status: 'Active'}})
    .then(user => res.render('confirmed', {user}))
    .catch(err => console.log("error"));
    
});

router.get("/profile", (req, res) => {
  User.findById(req.session.passport.user)
    .then(user => {
      if (user === null) {
        res.redirect('/')
      } else {
        res.render('profile', {user});
      }
    })
    .catch(err => {
      res.render('error');
    })
});


module.exports = router;