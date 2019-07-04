const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
});

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


// First create the user with status "Pending Confirmation" and a random confirmation code
// Then send an email with the confirmation link
// Then redirect to "/activate-your-account" that display "We ve sent an email"


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return
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
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    let confirmationCode = token

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
            "from": "My website",
            "to": email,
            "subject": "Please activate your account",
            "html": `Please fo to the link http://localhost:3000/auth/confirm/${confirmationCode}`
          })
          .then(info => {
            console.log("info", info)
            res.redirect("/auth/validate-your-account");  
          })
          .catch(error => console.log)
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});

router.get("/validate-your-account", (req,res,next) => {
  res.render("auth/validate-your-account")
})

router.get("/confirm/:confirmationCode", (req,res,next) => {
  let confirmationCode = req.params.confirmationCode
  User.findOneAndUpdate ({confirmationCode}, { status: "active" })
    .then(user => { 
    req.login(user, () => {
      res.redirect("/profile")
    })
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;