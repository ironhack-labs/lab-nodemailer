const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({  
  service: 'Gmail',  
  auth: {    
    user: '15ironhack@gmail.com',    
    pass: 'Ironhack15'  
}});


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
  const email    = req.body.email;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
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
      username: username,
      password: hashPass,
      status: `Pending Confirmation`,
      email: email,
      confirmationCode: token
    });

    transporter.sendMail({
      from: '"Jota" <15ironhack@gmail.com>',  
      to: `${newUser.email}`,  
      subject: 'Awesome Subject',  
      text: 'Awesome Message',  
      html: `<b>http://localhost:3000/auth/confirm/${newUser.confirmationCode}</b>`
    }).then(info => console.log(info)).catch(error => console.log(error))

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req,res) => {
  token = req.params.confirmationCode
  User.findOneAndUpdate({ confirmationCode: { $eq: token } },{status: 'Active'})
  .then(() => {
  res.render("auth/confirmation", req.user)
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
