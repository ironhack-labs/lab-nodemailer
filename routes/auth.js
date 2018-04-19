require('dotenv').config();
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  
  if (username === "" || password === "" || email === "") {
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

    const confirmationCode = encodeURIComponent(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode,
      email
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        const activationURL = `http://localhost:3000/auth/confirm/${confirmationCode}`;
       
        const user = process.env.GMAILUSER;
        const pass = process.env.GMAILPASS;

        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user,
            pass
          }
        });

        transporter.sendMail({
          from: user,
          to: email,
          subject: "Activate account",
          html: `<a href='${activationURL}'>Activate account</a>`
        })
        .then( info => console.log(info) )
        .catch( err => console.log(err) )        
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmationCode = encodeURIComponent(req.params.confirmCode);
  
  User.findOneAndUpdate({confirmationCode}, {"status":"Active"})
  .then( user => res.render("auth/confirmation", {user}) )
  .catch( () => res.redirect("/auth/signup"));
})

authRoutes.get("/profile/:id", (req, res, next) => {
  let id = req.params.id;

  User.findById(id)
  .then( user => res.render("auth/profile", {user}))
  .catch( () => res.redirect("/auth/signup") );
  
})

module.exports = authRoutes;
