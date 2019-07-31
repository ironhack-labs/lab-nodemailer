const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

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

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Rellena todos los campos" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }


    User.findOne({ email }, "email", (err, cor) => {
      if (cor !== null) {
        res.render("auth/signup", { message: "The email already exists" });
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
      confirmationCode: token,
      email: email
    });

let message=`<a href="http://localhost:3000/auth/confirm/${token}">Pincha aquí</a>`

let subject="Virus"


    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
      }
    });
  
  
  
    transporter.sendMail({
      from: '"Ironhacker Email 👻" <myawesome@project.com>',
      to: email,
      subject: subject,
      text: message,
      html: `<b>${message}</b>`
    })
      .then(info => res.render('message', { email, subject, message, info }))
      .catch(error => console.log(error));


    

    newUser.save()
    .then(() => {
      res.redirect("/");
      
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



})

router.get("/confirm/:confirmationCode", (req, res, next) => {
  const confirmationCode=req.params.confirmationCode
  console.log(confirmationCode)
  User.findOne({ confirmationCode }, "confirmationCode", (err, elm) => {
    if (elm!=null) {
     res.render("auth/confirmation");
     return
    }
    // })
    res.render("auth/confirmation");
      })
  
  })
module.exports = router;