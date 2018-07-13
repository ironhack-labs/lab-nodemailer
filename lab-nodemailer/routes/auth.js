const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");

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
  const confirmationCode = "";
  
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
    const hashPass2 = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashPass2,
    });
    
    
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        let { email, subject, message } = req.body;
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            // user: process.env.GMAIL_EMAIL,
            // pass: process.env.GMAIL_PASSWORD,
            user:"pepe04444@gmail.com",
            pass:"m20684-m20684"
          }
        });
        transporter.sendMail({
          from: '"My Awesome Project 👻" <myMAGNIFICO@project.com>',
          to: email, 
          subject: subject, 
          text: message,
          html: `<b>${message}</b>`
        })
        .then(info => res.render('message', {email, subject, message, info}))
        .catch(error => console.log(error));
      
      }
    });
    
    let { email, subject, message } = req.body;
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // user: process.env.GMAIL_EMAIL,
        // pass: process.env.GMAIL_PASSWORD,
        user:"pepe04444@gmail.com",
        pass:"m20684-m20684"
      }
    });
    transporter.sendMail({
      from: '"My Awesome Project 👻" <myMAGNIFICO@project.com>',
      to: email, 
      subject: subject, 
      text: message,
      html: `<b>${message}</b>`
    })
    .then(info => res.render('message', {email, subject, message, info}))
    .catch(error => console.log(error));
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
