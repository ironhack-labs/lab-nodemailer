const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")


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
  const token = generateToken();
  
  if (username === "" || password === "" || email === "") {
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

    const newUser = new User({
      username,
      password: hashPass,
      mail: email,
      confirmationCode: token
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: `${process.env.MAILUSER}`,
      pass: `${process.env.MAILPASS}`
    }
  });
  transporter.sendMail({
    from: `El madafaka`,
    to: email, 
    subject: "Te vas a registrar pillin", 
    text: "Pues confirma",
    html: `<a href="http://localhost:3000/auth/confirm/${token}">Confirm your email<a>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));


});

router.get('/confirm/:confirmationCode', (req, res, next) =>{
  User.updateOne({confirmationCode: req.params.confirmationCode},{status: "Active"})
  .then(()=>{
    res.render('confirmation')
  })
});



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function generateToken(){
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
 }
  return token
}




module.exports = router;
