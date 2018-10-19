const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require("../mail/mailer");

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
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
    res.render("auth/signup", { message: "Indicate username and password or email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    let hashUsername = bcrypt.hashSync(username, salt);
    hashUsername = hashUsername.replace(/\//g, '');
    hashUsername = hashUsername.replace(/\//g, '');
    const confirmationCode = encodeURIComponent(hashUsername);
    //let hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: confirmationCode

    });
    
    newUser.save()
    .then(() => {
      mailer.sendMail(email,hashUsername, username)
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  const code = encodeURIComponent(req.params.confirmCode);
  User.find({confirmationCode: code})
  .then((user) =>{
    User.findByIdAndUpdate(user[0]._id, {status: "Active"})
    .then((user) =>{
      res.render("auth/confirm", {user});
    })
  })
  .catch((e) => console.log(e))
 });

 router.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
