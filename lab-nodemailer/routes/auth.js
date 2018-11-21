const nodemailer = require('nodemailer')

const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sito.ironhack@gmail.com',
    pass: 'Ironhack.1' 
  }
});

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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const characters ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

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
      confirmationCode: token,
      email: email
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
  console.log(req.body.email);
  transporter.sendMail({
    from: '"My Awesome Project 👻" <sito.ironhack@gmail.com>',
    to: email, 
    subject: "Confirmation mail IronHack Sito", 
    text: "Esquilame",
    html: `<b>http://localhost:3000/auth/confirm/${token}</b>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res) => {
  console.log(req.params.confirmCode)
  User.findOneAndUpdate({confirmationCode:req.params.confirmCode},{$set:{status:"Active"}},{new: true})
  .then((user)=>{
    console.log("Usuario Activo")
    console.log(user)
    res.render("profile",{user})
  }).catch(()=>{
    console.log("A ocurrido un error de activacion")
  })
    
  
    
  
  
})

module.exports = router;
