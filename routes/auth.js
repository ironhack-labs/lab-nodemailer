const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail= require("../mail/sendMail.js")

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
  if (username === "" || password === ""|| email === "") {
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
    const hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: hashUser,
      email
    });

    newUser.save()
    .then( (user) => {
      sendMail(user.email,"Sign up confirmation", `<h1>Hello ${user.username},<h1><br>To confirm your email go to <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">here</a>`)
    })
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

router.get("/confirm/:confirmCode", (req,res)=>{
  console.log("ENTERED auth/confirm")
  User.findOneAndUpdate({confirmationCode:req.params.confirmCode},{status:"Active"})
    .then((user)=> {
    console.log(user)
    res.render("confirmation", {user})
  })
  .catch(e=>console.log("Error querying db"))
 })

router.get("/profile/:id", (req,res)=> {
  User.findById(req.params.id)
  .then((user)=> {res.render("profile", {user})})
  .catch(e=>console.log("Error querying db"))
})


module.exports = router;
