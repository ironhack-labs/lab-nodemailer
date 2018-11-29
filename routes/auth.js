const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {welcomeMail} = require("../helpers/mailer");

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

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
}
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username,password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser ={
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: token,
    };

    console.log(newUser)

    User.register(newUser, password)
    .then(user => {
      welcomeMail(user.email,user.username,user.confirmationCode)
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

router.get("/confirm/THE-CONFIRMATION-CODE-OF-THE-USER", (req,res) => {
  res.render("auth/auth")
  const username = req.body.usrname;
  const varCode = req.body.verCode;
  User.findOne(username)
      .then (user => {
        if (user.confirmationCode === varCode){
          router.patch()
          res.render("auth/succes")
        }else{
          res.render("auth/failure")
        }
      }).catch(err => {
        console.log(err)
      })
})


module.exports = router;
