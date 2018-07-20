const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.get("/confirm", (req,res,next) => {
  res.render("auth/confirm");
});

authRoutes.get("/confirm/:confirmCode",(res, req, next) => {
  
})

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
  const rol = req.body.role;
  const confirmationCode = req.body.username;
  //let {username, password,email,rol, confirmationCode} = req.body; no funciona

  if (username === "" || password === ""|| email==="") {
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
    const hashUser = bcrypt.hashSync(confirmationCode, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser,
      role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/confirm");
      }
    });
  });

 let link = 'localhost:3000/auth/confirm' + hashUser;
 let transporter = nodemailer.createTransport({  
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'drakarzamael@gmail.com',
      pass: 'xxxxxxxxx'
    }
    
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <drakarzamael@gmail.com>',
    to: email, 
    subject: 'hola nuevo usuario', 
    text: 'codigo de confirmacion sigue esta liga' + link,
 
    html: '<b>this is sparta</b>'+ link
})
.then(info => console.log(info))
.catch(error => console.log(error))

});//fin del post

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
