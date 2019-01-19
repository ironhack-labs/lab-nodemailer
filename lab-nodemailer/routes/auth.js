const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  // Génère un code de confirmation
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  // construit un user
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = token;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    // crypte le password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // genère un nouveau user
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    // enregistre le nouveau user en base
    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });

  // Evoi du mail de confirmation
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ritasandra.ironhack@gmail.com",
      pass: "ironhack"
    }
  });

  transporter
    .sendMail({
      from: " Sandra & Rita <ritasandra.ironhack@gmail.com>",
      to: email,
      subject: "Bienvenu sur notre site - confirmez votre compte",
      text: "Confirmez votre compte",
      html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}" > Confirmez votre compte</a>`
    })
    .then(info => console.log("mail sent"))
    .catch(error => console.log(error));
});

// Validation du code de confirmation de compte
router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmCode }, (err, user) => {
    if (user) {
      user.status = "Active";
      // nécessaire pour updater le statut en base
      user.save()
      res.render("auth/confirmation", { user: user });    
    } else {
      console.log("erreur de mail");
    }
  });
});

// Voir la page de profil
router.get("/profile/:id", (req, res, next) => {
  User.findOne({_id: req.params.id }, (err, user) => {
    // console.log(user)
    if (user && user.status == "Active") {
      res.render("auth/profile", { user: user });
    } else {
      console.log("erreur");
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
