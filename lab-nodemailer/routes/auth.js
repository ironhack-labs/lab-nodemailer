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
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  let token = '';
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    console.log(token, "primero")
    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: token,
      email
    });
    console.log(newUser, token, "segun consolelog")

    newUser.save()
    .then(() => {
      
    
      let transporter = nodemailer.createTransport({
        servicio: 'Gmail',
        auth:{
          user:'ironhackprueba0@gmail.com',
          pass:'ironhack2019'
        }
      })
      console.log(token, "tercero")
      transporter.sendMail({
        from:'"Ironhacker Email 👻" <myawesome@project.com>',
        to: email,
        subject: "hola",
        text: "buenos dias",
        html: `<p><a href="http://localhost:3000/auth/confirm/${token}"></a></p>`
      })
        .then(info => res.render('message', { email, subject, message, info }))
        .catch(error => console.log(error));
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
  
  // let{username,password,email}= req.body


});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
