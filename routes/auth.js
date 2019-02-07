const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login",(req,res,next) => res.render("auth/login"))

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
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  console.log(console)
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
      password: hashPass,
      status: "pending",
      token,
      email,
    });

    newUser.save()
    .then(() => {
      transporter.sendMail({
        from: "nodemailer test",
        to: req.body.email,
        subject: "Confirmation Code",
        text: "Please confirm your email",
        html: `<strong><a href=http://localhost:3000/auth/confirm/${token}>Confirm your email</a></strong>`
      })
      .then(() => res.redirect("/"))
      .catch(next)
    })
    .catch(next)
  });
});

router.get("/confirm/:token", (req,res,next) => {
  User.findOne({ token: req.params.token })
  .then(code => {
		console.log('TCL: code', code)
    if (code === null) {
      res.send("Incorrect code!")
    }
    else {
      User.findOneAndUpdate({token: req.params.token}, {status: "active"})
      .then(() => res.render("confirmation"))
      .catch(next)
    }
  }) 
  .catch(next) 
})

router.get("/profile", (req,res,next) => {
  User.findOne({_id: req.user.id})
  .then(user => res.render("auth/profile", {user}))
  .catch(next)
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
