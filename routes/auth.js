const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const mailer = require('../configs/nodemailler.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const {
    username,
    password,
    email
  } = req.body
  if (username === "" || password === "" || email === "") {
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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);


    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });
    mailer.sendMail({
        from: '"Ironhacker Email 👻" <myawesome@project.com>',
        to: email,
        subject: "confirmation code",
        text: `haz click aqui http://localhost:3000/auth/confirm/${token}`,
        html: `<a href="http://localhost:3000/auth/confirm/${token}">haz click aqui</a>`
      })
      .then(info => res.render('email-sent', {
        email,
        subject,
        message,
        info
      }))
      .catch(error => console.log(error));

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
})

router.get('/confirm/:confirmationCode', (req, res) => {
  User.findOneAndUpdate({confirmationCode:`${req.params.confirmationCode}`},{status:"Active"})
  
  .then(user => {
    console.log(user.confirmationCode)
    res.render("email-sent")
  }) 
  .catch(err => console.log("error al confirmar",err))
})

router.get('/profile', (req, res) => res.render('profile',{user:req.user}))


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

