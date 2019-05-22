const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User.models");
const sendMail = require("../email/sendMail")
const ensureLogin = require("connect-ensure-login")

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
  // Datos usuario
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }



  // Confirmar si usuario existe en BBDD
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }


    // Encriptación password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    // Creación ususario
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token,
      status: 'Pending Confirmation'
    });



    newUser.save()
    .then(( user) => {
      const subject = "Confirmation Email"
      const message = `<h1>IronHack</h1><h2>IronHack Confirmation Email</h2><h3>Hello ${user.username}</h3><p>Thanks to join our community! Please confirm your account clicking on the following link:</p><p><a href="http://localhost:3000/auth/confirmation/${user.confirmationCode}">http://localhost:3000/auth/confirmation/${user.confirmationCode}</a></p>`
      
      sendMail( user.email, subject, message)
      .then()
      res.redirect("/"); 
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirmation/:token", (req, res, next) => {
  const token = req.params.token
  console.log(req.params)
  User.findOne({confirmationCode: token}).then( foundUser => {

    User.updateOne(foundUser, {status: 'Active'})
      .then(editedUser => {

        setTimeout(() => {
          console.log(editedUser)
          res.redirect("/")
        }, 3000)
      })
    // res.render("auth/confirmation")
  })


})

router.get("/profile", ensureLogin.ensureLoggedIn('/'),(req, res) => {
  console.log(req.user)
  res.render("auth/profile", {user: req.user})
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
