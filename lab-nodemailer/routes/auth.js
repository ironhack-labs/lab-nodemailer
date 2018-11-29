const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {welcomeMail} = require('../helpers/nodemailer')

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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });

    newUser.save()
    .then(() => {
      welcomeMail(username, email, token)
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

router.get('/confirm/:token',(req,res,next)=>{
  let activeUser = req.user
  const token = req.params.token

  if(activeUser.confirmationCode === token){
    console.log('son iguales')
    activeUser.status = "active"
    User.findByIdAndUpdate(activeUser._id, activeUser)
    .then (updated =>{
      res.render('confirm', {token, message: 'Confirmed'})
    })
    .catch(err =>next(err))
    
  } else {
    console.log("Sorry bruh")
  res.render("confirm", {token, message: 'Incorrect'})
  }
})

module.exports = router;
