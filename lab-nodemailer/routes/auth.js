const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
require('dotenv').config({path: '.private.env'});
const nodemailer = require('nodemailer');
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
  console.log(process.env);
  
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
    const hashConfirmCode  = bcrypt.hashSync(username, salt);
    const uriCode = encodeURIComponent(hashConfirmCode);

    if(!process.env.GMAIL_USER || !process.env.GMAIL_PASSW) {
      throw new Error('You have to configure mail credentials in .private.env file');
    }

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSW
      }
    });
    
    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashConfirmCode,
      email: email
    });

    const sendMail = (from, to, subject, text) => {
      return transporter.sendMail({
      from: 'Pepe',
      to: email, 
      subject: 'your registration in our awesome web', 
      text: `Welcome to Weronika&Espe awesome web. Confirm registration here: http://localhost:3000/auth/confirm/${uriCode}`
    })

    .then(info => console.log(info))
    .catch(error => console.log(error));
  }

    newUser.save()
    .then((user) => {
      sendMail(user).then(() => {
        console.log("mensaje enviado")
        res.redirect("/");
      })
    })
    .catch(err => {
      res.render("auth/signup", { message: err });
    })
  });
});

router.get("/confirm/:parametroInutil", (req, res, next) => {
  let codeId = req.params.parametroInutil;
  console.log(encodeURIComponent(codeId))
  User.findOneAndUpdate({'confirmationCode': codeId}, {status: 'Active'}, {new:true})
  .then (pepe => {
    console.log(pepe)
    res.render("auth/confirm/confirmCode");
  })
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");  
});

module.exports = router;