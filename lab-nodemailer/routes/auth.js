const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const randToken = require("rand-token");
const nodemailer = require("nodemailer");
const confirmationEmail = require('../templates/template')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD 
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
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (validateEmail(email)==false) {
    res.render("auth/signup", { message: "Invalid email format" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = randToken.generate(30);
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
      
    });

    
    newUser.save()
    .then((user) => {
      console.log(user.confirmationCode, user)
      transporter.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: `${email}`, 
        subject: 'Awesome Subject', 
        text: 'Awesome Message',
        html: confirmationEmail(user.username, `http://localhost:3000/auth/confirmation/${user.confirmationCode}`),
        // html: `<b>Awesome Message</b><a href="localhost:3000/auth/confirmation/${confirmationCode}">Confirm your account</a>`
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))
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

router.get("/confirmation/:confirmation", (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmation}, {$set:{status: true}})
  .then(newUser => {
    if(newUser) {
      res.render("auth/confirmation");
      
    }
    else {
      res.render("auth/autherr");
      
    }
  })




})





module.exports = router;
