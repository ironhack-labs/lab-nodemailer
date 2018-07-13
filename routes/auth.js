require('dotenv').config();
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

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
  console.log("Entra")
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
    const usernamehash = bcrypt.hashSync(username, salt).replace('/', '');


    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      status: "Pending Confirmation",
      confirmationCode: encodeURI(usernamehash)
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.mail,
            pass: process.env.password
          }
        });

        transporter.sendMail({

          to: process.env.mail,
          subject: 'Awesome Subject',
          html: `haz click en el enlace para confirmar : http:localhost:3000/auth/confirm/${usernamehash}`
        })
          .then(info => { console.log(info); res.redirect("/"); })
          .catch(error => console.log(error))

      }
    });
  });
});

authRoutes.get('/confirm/:confirmCode', (req, res) => {
  const code = req.params.confirmCode;

  User.findOneAndUpdate({ confirmationCode: code }, { status: 'Active' }).then(user => res.render('confirmation', { user }))
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
