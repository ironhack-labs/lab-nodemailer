const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pepe04444@gmail.com',
    pass: 'm20684-m20684'
  }
});

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


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
  const email = req.body.email;
  const status = req.body.status;
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
    const hashConfirm = encodeURIComponent(bcrypt.hashSync(username, salt)); // se mete el encodeuri para que no salgan 	; , / ? : @ & = + $ al generarse la encriptacion

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirm,
      status,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transporter.sendMail({  // esto envía el email cuando hay un nuevo sign up
          //from: '"My Awesome Project 👻" <myawesome@project.com>', ya lo estoy usando con los datos de arriba en let transporter
          to: email, 
          subject: "Confirm your email", 
          html: `
          <h2>Please confirm your email address.</h2>
          <a href="http://localhost:3000/auth/confirm/${hashConfirm}">Activa tu cuenta</a>
          `
        })
        .then(res.redirect("/"))
        .catch(error => console.log(error));
      }
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {  //cuando recibes el correo confirmar con el link
  let confirmationCode = encodeURIComponent(req.params.confirmCode);
  User.findOne({confirmationCode})
  .then(user => {
    console.log("aaaa");
    console.log(user);
    if(user) {
      User.findByIdAndUpdate(user._id, {status: "Active"})
      .then(() => {
        res.render("confirmation");
      })
      .catch(err => {
        next(err);
      });
    }
  })
  .catch(err => {
    console.log("aaaa")
    next(err);
  })
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
