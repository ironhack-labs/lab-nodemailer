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

// Route POST Signup
router.post("/signup", (req, res, next) => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const username = req.body.username;
  const password = req.body.password;
  //const status = "Pending Confirmation";
  const confirmationCode = token;
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

    //Génération du code de confirmation //"nodemailer": "^5.1.1",

    const newUser = new User({
      username,
      password: hashPass,
      //status,
      confirmationCode,
      email
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ritasandra.ironhack@gmail.com",
      pass: "ironhack"
    }
  });

  transporter
    .sendMail({
      from: "RitaSandra <ritasandra.ironhack@gmail.com>",
      to: email,
      subject: "Confirmation de compte",
      text: "Confirmer votre code",
      html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirmer votre code</a>`
    })
    .then(info => console.log("mail sent"))
    .catch(error => console.log(error));
});

// Validation du code de confirmation de compte
router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOne({confirmationCode: req.params.confirmCode}, (err, user) => {
    console.log(user);
    if(user) {
      res.render("auth/confirmation", {user:user})
      user.status = "Active";
      user.save();
      console.log(user);
    } 
    else {
      console.log("erreur de mail")
    }
  })
});

// Voir la page de profil
router.get("/profile/:id", (req, res, next) => {
  User.findOne({_id: req.params.id }, (err, user) => {
    console.log(user)
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
