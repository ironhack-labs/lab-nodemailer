const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require ("nodemailer");

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
  const {username,password,email} = req.body;
  console.log(req.body);

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
    const hashUsername = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUsername
    });
console.log(newUser);
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        subject="Correo de confirmacion";
        message="http://localhost:3000/auth/confirm/"+hashUsername;

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'pepe04444@gmail.com',
            pass: 'm20684-m20684'
          }})

        transporter.sendMail({
          from: '"My Awesome Project 👻" <pepe04444@gmail.com>',
          to: email,
          subject: subject,
          text: message,
          html: `<b>${message}</b>`
        })

        .then(() => console.log("Se esta enviando el email!"))
        
        .catch(error => console.log(error));
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;

//info => res.render('message', {email, subject, message, info})