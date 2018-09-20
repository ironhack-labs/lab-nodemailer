const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../helpers/mailer').sendMail

// Bcrypt to encrypt passwords
const bcryptjs = require("bcryptjs");
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
  const email = req.body.email
  if (username === "" || password === "" || email==="") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcryptjs.genSaltSync(bcryptSalt);
    const hashPass = bcryptjs.hashSync(password, salt);
    const hashUser = bcryptjs.hashSync(username, salt);
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode:hashUser
    });

    newUser.save()
    .then(() => {
      sendMail(req.body.email,"Ezequiel Machiwi te da la bienvenida",`http://localhost:3000/auth/confirm/${hashUser}`)
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

router.get('/confirm/:code',(req,res,next)=>{
  const {code} = req.params
  User.findOne({confirmationCode:code})
  .then(user=>{
    User.findByIdAndUpdate(user._id,{$set:{status:'Active'}},{new:true})
    .then(usera=>{
      res.render('auth/confirm',usera)  
    })
    .catch(er=>next(er))
  })
  .catch(e=>next(e))
})

module.exports = router;
