const express     = require("express");
const passport    = require('passport');
const authRoutes  = express.Router();
const User        = require("../models/User");
const nodemailer  = require('nodemailer');
require('dotenv').config();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get('/profile', (req, res) =>{
  console.log(req.params)
  res.render('auth/profile'
);
});

authRoutes.get('/confirmuser/:confirmationCode', (req, res) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmationCode}, {$set:{status: 'Active'}}, {returnNewDocument: true})
  .then(r => {
    console.log(r)
    res.render('auth/change', {r});
  });
});


authRoutes.get('/confirm/:code', (req, res) => {
  console.log(req.params.code)
  User.findOne({confirmationCode: req.params.code})
  .then(r=> {
    res.render('auth/confirmation', r)
  })
  .catch(e => next(e));
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;
  const rol      = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt             = bcrypt.genSaltSync(bcryptSalt);
    const hashPass         = bcrypt.hashSync(password, salt);
    let confirmationCode = bcrypt.hashSync(username, salt);
    console.log(confirmationCode);
    confirmationCode = confirmationCode.split("").filter(function(a){return a!=="/"}).join("")
    console.log(confirmationCode);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
      role: "teacher"
    });

    const tp = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    tp.sendMail({
      from: '"Diurivj" <fixtegeek@gmail.com>',
      to: email, 
      subject: 'Confirm email', 
      text: 'Confirma el correo por favor',
      html: `<a href="http://localhost:3000/auth/confirmuser/${confirmationCode}">Confirma aquí</a>`
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect(`confirm/${confirmationCode}`);
      }
    });
  });

});



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
