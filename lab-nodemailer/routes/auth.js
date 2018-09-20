const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../mail/sendMail');
const hbs = require('handlebars');
const fs = require('fs');
const ensureLogin = require('connect-ensure-login');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));



router.get("/confirm/:confirmationCode", (req, res, next) => {
  const confirmationCode = req.params.confirmationCode;
  User.findOneAndUpdate({"confirmationCode":confirmationCode} , {status: "Active"}, {new:true})
 .then(user => {
  res.render('auth/confirm', {user});
 })
 .catch(err => next(err.message))
})

router.get('/profile', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  let user = req.user
  res.render('auth/profile', {user});
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});



router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
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
    const hashCode = encodeURI(bcrypt.hashSync(username, salt)).replace("/", "");

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashCode,
      email

    });

    newUser.save()
    .then((user) => {
      //send email code 
      let templateStr = fs.readFileSync('./mail/templates/mailText.hbs').toString();
      let template = hbs.compile(templateStr); 
      let html = template({user});
      sendMail(email,`singup sucess: ${username}`,html)
      .then(() => console.log('email enviado'))
      .catch(err => console.log(err))
    })
    .then(() => {
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

module.exports = router;
