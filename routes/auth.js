const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../helpers/mailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Aux Functions

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1);
  }));
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// Auth Routes

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect(`/profile/${req.user._id}`)
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate email, username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashUsername = bcrypt.hashSync(username, salt);
    
    
    const newUser = new User({
      email,
      username,
      password: hashPass,
      confirmationCode: hashUsername
    });
    
    newUser.save()
    .then(() => {

      let options = {};
      options.filename = 'verify';
      options.email = email;
      options.username = username;
      options.subject = 'Please, verify your email';

      let encodedCode = encodeURIComponent(hashUsername);

      options.confirmationCode = encodedCode;

      console.log('=====>')
      console.log('Options',options)

      mailer.send(options)
        .then(()=>{
          res.status(200).send('Mail succesfully sended...')
        })
        .catch(err => {
          console.log('Something went wrong MAIL', err);
        });
      //res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong USER", err });
      console.log(err);
    })
  });
});

router.get('/confirm/:confirmationCode', (req, res) => {
  console.log('Confirmation......')

  let decodedCode = decodeURIComponent(req.params.confirmationCode);


  User.findOneAndUpdate({confirmationCode: decodedCode}, {status: "Active"})
    .then(user => {
      console.log('=====>',user);
      res.render('auth/confirmation', {user})
    })
    .catch(err => {
      console.log('Confirm error', err)
    })


  //User.findOne({confirmationCode}, 'confirmationCode', (err, confirmationCode) => {
  //  if (confirmationCode === req.params.confirmationCode) {
  //    console.log('CC1',confirmationCode);
  //    console.log('CC1',req.params.confirmationCode);
  //  };
  //});
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
