const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const hbs = require("handlebars");
const fs = require("fs");

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
  const saltConfirmation = bcrypt.genSaltSync(bcryptSalt);
  const URI = bcrypt.hashSync(username, saltConfirmation);
  const confirmationCode = encodeURIComponent(URI);
  

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
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
    .then((user) => {
      let code = user.confirmationCode; 
      let html = `<p>Sara, Celia, Laura</p>
      <p>Your confirmation code is: ${code}</p>
      <a href=http://localhost:3000/auth/confirm/${code}>Click here to activate</a>`
      
      sendMail(user.email, "confirm your email", html)
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

router.get("/confirm/:confirmCode", (req, res) => {
  const code = encodeURIComponent(req.params.confirmCode);
  User.find({confirmationCode: code})
  .then((user) =>{
    User.findByIdAndUpdate(user[0]._id, {status: "Active"})
    .then((user) =>{
      res.render("auth/confirmation", {user});
    })
  })
  .catch((e) => console.log("no sale" + e))

});

module.exports = router;
