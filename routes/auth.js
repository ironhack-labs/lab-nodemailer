const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const { confirmAccount } = require ('../config/nodemailer')

exports.indexGet = (req, res, next) => res.render('index')


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

router.post("/signup", async(req, res, next) => {
   const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  console.log('sign up')
 // const confirmationCode =req.body.confirmationCode;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  console.log( 'adios');
  
  await User.findOne({ username }, "username", async (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
console.log('valida');

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token,
    });
    console.log('crea');
    newUser.save()
    .then(() => {


       confirmAccount(
        email,
        `http://localhost:3000/auth/confirm/${token}`
      )








      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});
console.log('correo');

exports.signupPost = async (req, res, next) => {
  const { name, email, password } = req.body
  console.log('hola');
  const user = await User.register({ name, email }, password)
 
  
  
  console.log( 'envia');
  
  res.render('index', { msg: 'User registered' })
}

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
