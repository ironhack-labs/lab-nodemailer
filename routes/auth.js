const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const { transporter } = require("../mailing/transporter");

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
  const { username, password, email } = req.body;
  
  var fieldsPromise = new Promise((resolve, reject) => {
    if (username === "" || password === "" || email === "") {
      reject(new Error("Indicate a username, email and password to sign up"));
    } else {
      resolve();
    }
  });

  fieldsPromise
    .then(() => {
      return User.findOne({ username });
    })
    .then(user => {
      if (user) {
        throw new Error("The username already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const confirmationCode = encodeURIComponent(bcrypt.hashSync(username, salt));

      const newUser = new User({
        username,
        email,
        password: hashPass,
        confirmationCode
      });

      return newUser.save();
    })
    .then(user => {
      res.redirect("/");

      const message = `http://localhost:3000/auth/confirm/${user.confirmationCode}`;

      transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.email, 
        subject: "Sign up confirmation", 
        text: message,
        html: `<b><a href="${message}">Confirm your account</a></b>`
      })
      .then(info => console.log(info))
      .catch(error => console.log(error));
    })
    .catch(err => {
      res.render("auth/signup", {
        errorMessage: err.message
      });
    });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
