const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/User");
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pepe.ironhack@gmail.com',
    pass: 'pepe1234Ironhack' 
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
    const hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser,
      status: "Pending Confirmation"
    })
    ;

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {

        let message = {
          // Comma separated list of recipients
          to: `${newUser.username} <${newUser.email}>`,
          // Subject of the message
          subject: 'Hello. Your confirmation e-mail',
          // plaintext body
          html: `http://localhost:3000/auth/confirm/${newUser.confirmationCode}`,
        }

        transporter.sendMail(message, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
        res.redirect("/");
      }
    })
  });
});
authRoutes.get(`/confirm/:confirmCode`, (req,res) => {
  User.findOne({ 'confirmationCode':`${req.params.confirmCode}`})
  .then(user => {
    console.log(user)
    res.render("auth/confirmation", {user})
  }) 
})

authRoutes.get("/confirmation", (req,res) => { 
  User.findOne({ 'confirmationCode':`${req.params.confirmCode}`},'username', (err, user) => {
    console.log(user)
    res.render("auth/confirmation", {user})
  })
})

authRoutes.get("/profile", (req,res) => {
  res.render("profile")
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
