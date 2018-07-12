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
    const confirmationCode = bcrypt.hashSync(username, salt).replace('/','');

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
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.user,
            pass: process.env.secret
          }
        });
        transporter.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: email, 
          subject: 'Awesome Subject', 
          text: confirmationCode,
          html: `http://localhost:3000/auth/confirm/${confirmationCode}`


        })
        .then(info => console.log(info))
        .catch(error => console.log(error))
      }
    });
  });
});

authRoutes.get("/confirm/:confirmationCode", (req, res) => {
 const code = req.params.confirmationCode;
 User.findOneAndUpdate({
   confirmationCode:code
 },'confirmationCode',(err,code)=>{
   if(code!=null){
     code.status='Active';
     code.save();
     res.render('auth/confirmation');
   }else{
     console.log(err)
   }
 })
});


authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
