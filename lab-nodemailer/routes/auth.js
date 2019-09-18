const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  const email = req.body.email;
  const password = req.body.password;
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
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
     
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const confirmationCode = token;

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
      }
    });

    console.log(email);
    transporter
      .sendMail({
        from: '"Paula 🦄" <myawesome@project.com>',
        to: email,
        subject: "Confirmar email",
        text: `http://localhost:3000/auth/confirm/${confirmationCode}`,
        html: `http://localhost:3000/auth/confirm/${confirmationCode}`
      })
      .then(() => console.log("Email enviado"))
      .catch(err => console.log("Ha habido un error: ", err));

    const newUser = new User({
      username,
      email,
      password: hashPass, 
      confirmationCode
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  const confirmCode = req.params.confirmCode;
  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { $set: { status: "Active" } }
  )
    .then(user => {
      res.render("index");
    })
    .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", (req, res, next) => {
  const user = req.user;
  res.render("auth/profile", { user });
});

module.exports = router;

