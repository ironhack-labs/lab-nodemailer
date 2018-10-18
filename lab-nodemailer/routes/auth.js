const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../helpers/mailer');

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
      options.confirmationCode = hashUsername;

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

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
