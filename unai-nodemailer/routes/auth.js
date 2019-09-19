const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const transporter = require('../configs/nodemailer.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
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
    const characters ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    
    router.post('/send-email', (req, res, next) => {
      let { email, subject, message } = req.body;
      res.render('message', { email, subject, message })
    });

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: token,
      email:email
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode:req.params.confirmCode},{$set:{active:true}},{new: true})
  .then((user)=>{
    res.render("auth/activation",{user})
  }).catch(()=>{
    console.log("A ocurrido un error de activacion")
  })  
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
