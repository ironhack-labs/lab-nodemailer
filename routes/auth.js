const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/profile", ensureAuthenticated, (req,res) => {
  const user = req.user
  res.render("profile", {user})
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  const {username, password, email} = req.body

  if (username === "" || !(/\S+@\S+\.\S+/.test(email)) || password === "") {
    res.render("auth/signup", { message: "Indicate username, email and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let confirmationCode = '';
    for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length )];
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode,
      email
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'felipereyesmoreno.prueba@gmail.com',
        pass: 'prueba_1234' 
      }
    })

    transporter.sendMail({
      from: "Nodemailer Project - Verification Code",
      to: email, 
      subject: "Hello " + username + " , please confirm your email", 
      html: '<p>You have to confirm your email. Please, visit this link:</p><p><a href="http://localhost:4000/auth/confirm/' + username + '/' + confirmationCode + '" target="_blank">Haz clic aquí</a></p>'
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
    


  });
});

router.get("/confirm/:username/:confirmCode", (req, res) => {
  const {username, confirmCode} = req.params

  User.findOne({username})
  .then(user => {
    if (user.confirmationCode === confirmCode){
      user.status = "Active",
      user.save()
      .then(user => res.render("mailing/confirmation", {user}))
      .catch(err => console.log("No ha cambiado en la BBDD el estado a Activo" + err))
    }
  })
  .catch (err => console.log("No ha encontrado al user que pinchó en el mail" + err))
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
