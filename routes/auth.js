const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//configure the nodemailer transporter
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pepe04444@gmail.com',
    pass: 'm20684-m20684'
  }
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmationCode = encodeURIComponent(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirmationCode
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      } else {
        transporter.sendMail({
            to: email,
            subject: 'Confirm your identity',
            html: `<p>Hello ${username} Just click <a href="http://localhost:3000/auth/confirm/${hashConfirmationCode}">here</a> to confirm your identity.</p>`
          })
          .then((info) => console.log(info))
          .catch(error => console.log(error))
        res.render("auth/informs");
      }
    });
  });
});

authRoutes.get("/confirm/:code", (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: encodeURIComponent(req.params.code)}, {status: "Active"}, {new:true})
    .then ((user) =>{
      console.log("User activated");
      res.render("auth/confirmation", user);
    })
    .catch ((error) => {
      console.log(error);
      res.render("/");
    });

});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;