const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const hbs = require('hbs');
require('dotenv').config();


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


authRoutes.get("http://localhost:3000/auth/confirm/:confirmationCode", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const mail = req.body.email;
  if (username === "" || password === "" || mail === "") {
    res.render("auth/signup", { message: "Indicate username, password and mail" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hassUser = bcrypt.hashSync(username, salt)
    const validhassUser = hassUser.replace("/", "-").replace("$", "-")
    const newUser = new User({
      username,
      password: hashPass,
      mail,
      confirmationCode: validhassUser,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        console.log("new user created")
      }
    });

    //send email
    let link = `http://localhost:3000/auth/confirm/${validhassUser}`
    let message= `Please, confirm your account here: ${link}`
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS
      }
      
    });
  
    transporter.sendMail({
      from: process.env.NODE_MAIL,
      to: 'aecdigitaltransformer@gmail.com', 
      subject: 'PruebaMail', 
      html: `<b>${message}</b>`
    })
    .then(info => res.render('auth/signup'))
    .catch(error => console.log(error));
  })
  });

  authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
    let confirmCode = req.params.confirmCode;
    User.findOneAndUpdate({confirmationCode:confirmCode}, {$set:{status:"Active"}},{new:true})
    .then( user => {
      res.render('profile', { user })
    }) 
    .catch(error => console.log(error));
});





authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

module.exports = authRoutes;



