require('dotenv').config({path: '.private.env'})
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendEmail = require('../mails/sendMail')
const ensureLogin = require('connect-ensure-login')

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
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashUser = bcrypt.hashSync(username, salt);
  const confirmationCode = hashUser;
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
      confirmationCode
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .then(() => {
      console.log(process.env.GMAIL_USER);
      console.log(process.env.GMAIL_PW);
      
      sendEmail(newUser.email, 'ACTIVA TU CUENTA',`http://localhost:3000/auth/confirm/${confirmationCode}`)
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:id', ensureLogin.ensureLoggedIn('auth/login'), (req,res,next) => {
  let code = req.params.id;
  User.findOneAndUpdate({confirmationCode: code}, { $set: { status: 'Active'} })
  .then((a) => {
      res.render('profile', { a })
    })
  .catch(e => console.log(e))
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
