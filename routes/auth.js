
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const sendMail =require("../mailing/send.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email=req.body.email;
 
  if (username === "" || password === ""|| email==="") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (!email.includes('@')) {
    res.render("auth/signup", { message: "You have to indicate a valid email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashUser = encodeURIComponent(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser
      
    });

   
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        const urlConf =`http://localhost:3000/auth/confirm/${hashUser}`;
        sendMail(email, urlConf);
        res.redirect("/");
      }
    });
  });
});

  authRoutes.get("/confirm/:hashUser",(req,res)=>{
    const code =encodeURIComponent(req.params.hashUser);
    User.findOneAndUpdate({confirmationCode: code},{status:'Active'},(err)=>{
      if(err){
        console.log("No se pudo actualizar")
      }
      else {
        User.findOne({confirmationCode: code})
        .then((user)=>{
        res.render("auth/confirmation", {username: user.username});
        })
      }
    })
  })  

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
