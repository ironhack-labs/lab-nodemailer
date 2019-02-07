const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Creating confirmation codes
function generateCode() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  return token;
}
//Nodemailer transporter set up
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});
// login routes
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));
//signup routes
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body
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
      email,
      confirmationCode: generateCode()
    });
    const signUpLink = `http://localhost:3000/auth/confirm/${newUser.confirmationCode}` // might not need the newUser. ... 
    Promise.all([newUser.save(), transporter.sendMail({
      from: '"My Awesome Project 👻" <charlotte.treuse@gmail7fff00.com>', //- the sender in the email 
      to: email, 
      subject: "validate your account", 
      text: `Your sign up link is ${signUpLink}`,
      html: `<h1>Confirmation Email</h1>
      <h2>Hello ${username}</h2>
      <p>Confirm your account by clicking on the link below</p> 
      <b>${signUpLink}</b>`
    })])
    .then(()=> {
      res.redirect("/auth/signup-done");// 
    }) // usually good to redirect to anohter page rather than the same get page because can mess with teh posts and submites
    .catch( err => console.log('error: ', err))
  })
});

router.get('/signup-done', (req,res,next) => { // all routes prefixed by /auth
  res.render("auth/signup-done")
})
// activation route
router.get('/confirm/:confirmCode', (req,res,next) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {status: "Active"})
  .then((user) => {
    if(user)
    req.logIn(user, () => {
      res.render('auth/confirmation-success', {
        user,
        isActiveAndConnected: true
      })
    })
    else res.render('auth/confirmation-failed')
  })
})
//log out routes
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
