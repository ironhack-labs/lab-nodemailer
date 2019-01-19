const express = require("express");
const passport = require('passport');
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'lazoneenpersonne75@gmail.com',
    pass: 'lazone2019' 
  }
});

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
  const status = "Pending";
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  };
  const confirmationCode = token;
  const baseURL = "http://localhost:3000/auth/confirm/"
  const confirmationURL = baseURL.concat(confirmationCode);
  console.log(confirmationURL);
  if (username === "" || password === ""|| email === "") {
    res.render("auth/signup", { message: "Indicate username and password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
     
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode,
      status
    });

    newUser.save()
    // const message = res.render('/views/auth/message', function(err, html){console.log(html)});
    transporter.sendMail({
      from: '"La Zone" <lazoneenpersonne75@gmail.com>',
      to: email, 
      subject: "Thank you for signing up!", 
      text: confirmationURL,
      html:`<b>${confirmationURL}</b>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
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

router.get('/confirm/:confirmCode', (req, res) => {
User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, {$set: {status:"active"}})
.then(user => {
  console.log(user.confirmationCode);
  console.log(user.status);
  res.render("auth/confirmation", { user:user });
})
});

router.get('/profile/:id', (req, res) => {
  console.log("ok");
  // User.findOne({ _id: req.params.id })
  // .then(user => {
  //   console.log(user.username);
  //   res.render("/profile", {user:user})
  // })
  });

module.exports = router;
