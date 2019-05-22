const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../email/sendMail")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

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

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let confirmationCode = ''
    for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    const message = `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirma tu cuenta clickando en este link</a>`

    newUser.save()
      .then(() => {
        sendMail(newUser.email, 'Confirma tu cuenta', message)
          .then(info => {
            console.log(info)
            res.render("auth/login", { message: "Comprueba tu email y confirma tu cuenta" })
          })
          .catch(err => {
            console.log(err)
            res.render("auth/signup", { message: "Something went wrong sending the email" })
          })

      })
      .catch(err => res.render("auth/signup", { message: "Something went wrong saving the user" }))
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { $set: { status: 'Active' } }, { new: true })
    .then(result => {
      console.log(result)
      if (result)
        res.render('auth/confirmation', { successMessage: 'Todo ha ido bien pishita/shoshete' })
      else
        res.render("auth/confirmation", { errorMessage: "Something went wrong with the confirmation" })
    })
    .catch(err => res.render("auth/confirmation", { errorMessage: "Something went wrong with the confirmation" }))
})





module.exports = router
