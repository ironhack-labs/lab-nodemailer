const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {confirmAccount} = require('../config/nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}

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

router.post("/signup", async (req, res, next) => {
  // const username = req.body.username;
  // const password = req.body.password;
  // const email     = req.body.email;

  const {username, password, email} = req.body
console.log(req.body)
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  await User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: token
    });
    
    
    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
    let {confirmationCode} = newUser
    console.log(newUser);
    confirmAccount(
  email, 
   `http://localhost:3000/auth/confirm:${confirmationCode}`

)

  });
});




router.get('/confirm:id', (req,res)=>{
  res.render('auth/confirm')
})





router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
