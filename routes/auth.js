const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/auth/confirm/:confirmCode",(req,res,next) => {
  User.findOne({ confirmCode }, req.param.confirmCode, (err, user) => {
    .then (user.updateOne({status}, "Active",(err, user) => {res.redirect("/")})
    .catch(error => console.log(error))
    )}
  )
})


router.post("/signup", (req, res, next) => {
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
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    
  }
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });

    newUser.save()
    .then(() => {
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'pruebanodemailer0119@gmail.com',
          pass: 'Prueba-nodemailer-0119'
        }
      });
      let message = "Thanks to joins our communiuty ! Please confirm you account on the falowing link "
      
      transporter.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: "IronHack Confirmation Email", 
        text: message,
        
        html: "Thanks to joins our communiuty ! Please confirm you account on the falowing link http://localhost:3000/auth/confirm/" + token
      })
    .then(info => res.render('message', {email, subject, message, info}))
    .catch(error => console.log(error));
    });
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
