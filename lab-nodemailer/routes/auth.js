const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../email/sendEmail")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//LOG IN

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

//SIGN UP

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = req.body.confirmationCode;
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
      confirmationCode: token,
    });

    const message = `<a href="http://localhost:3000/auth/confirm/${token}">${token}</a>`

    newUser.save()
    .then(() => {
      sendMail(email,message)
      .then(res.redirect("/"), { message: "Registro correcto" })
      .catch(err => {
        res.render("auth/signup", { message: "Error", err })})
   
    })
  });
});

//LOG OUT

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get("/confirm/:confirmationCode",(req,res)=>{
   const code = req.params.confirmationCode
   
     User.findOne({confirmationCode: code})
      .then(loguser=> {
        User.updateOne(loguser, {status: "Active"})
          .then(res.render("auth/confirm", {maria: loguser}))
        })

      .catch(err => console.log(err))

    
})


module.exports = router;
