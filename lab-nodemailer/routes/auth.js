const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/User");

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
  if (username === "" || password === "" || email === "" ) {
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
      confirmationCode: token,
      email
    });

    console.log(newUser)
    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ralucaironhack@gmail.com',
        pass: 'ralucaironhack1212'
      }
    });
  
    transporter.sendMail({
      from: '"Ironhacker Email 👻" <myawesome@project.com>',
      to: email,
      subject: "Confirmation",
      text: "Bienvenido a nuestra web",
      html: `<b>http://localhost:3000/auth/confirm/${token}/${username}</b>`
    })
      .then(info => res.render('message', { email, subject, message, info }))
      .catch(error => console.log(error));
  });
  
  });

  router.get("/confirm/:confirmCode/:username", (req, res, next) => {
    const {confirmationCode, username} = req.params

    User.findOne({username},'username')
    .then(user =>{
      if(user.confirmationCode === confirmationCode){
        user.status = "Active" 
        user.save().then(user => res.render("auth/confirmation",{user}))
        .catch(error=>console.log(error))
      }
    })
  })
  
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router
