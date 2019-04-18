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

  //pedimos los parametros
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  //token
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }

  let confirmationCode = token;

  // no lo dejes en blanco
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  //chequeo que no esté creado

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode
    });
    
  // Guardamos usuario
    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: `${process.env.MAIL}`,
      pass: `${process.env.CONTRASEÑA}`
    }
  })


  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email, 
    subject: `Confirmación de cuenta de ${username}`, 
    html: `<a href="http://localhost:3008/auth/confirmado/${confirmationCode}">Link</a>`
  })
  .then(info => res.json({email, subject, message, info}))
  // .catch(error => console.log(error));

  


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
