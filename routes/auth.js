const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
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
    const hashConfirm = encodeURI(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirm
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transport.sendMail({
          from: "Admin <test@truc.com>",
          to: email,
          subject: "Confirm your address",
          text: `Hello,
          Please confirm your email address by copying this link
          http://localhost:3000/auth/confirm/${hashConfirm}`,
          html: `<h1>Hello</h1>
          <p>Plese confirm you email addres by clicking on this link :
          <a href="http://localhost:3000/auth/confirm/${hashConfirm}">Confirm</a></p>`
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          next(err);
        });
      }
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  console.log(req.params.confirmCode);
  User.findOne({confirmationCode : req.params.confirmCode})
  .then(user => {
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
    next(err);
  })
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
