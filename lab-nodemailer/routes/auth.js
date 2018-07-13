const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:" pepe04444@gmail.com",
    pass: "m20684-m20684"
  }
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.get("/profile/:id", (req, res) => {
  let id=req.params.id
  User.findById(id).then(user =>{
    res.render("auth/profile",{user})
  })

})

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
  let { username,password,email } = req.body;
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
    const hashCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode:hashCode,
      email:email
    });
    let txt = encodeURIComponent(hashCode);
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    }).then(()=>{
      transporter.sendMail({
        to: email, 
        subject: "Email Hackeado", 
        text:"prueba aaaaaaacoño",
        html: `<b>http://localhost:3000/auth/confirm/${txt}</b>`
      })
    })
  });
});

authRoutes.get("/confirm/:confirmCode",(req,res)=>{
  User.findOne({confirmationCode:req.params.confirmCode})
  .then(user1 =>{
    User.findByIdAndUpdate(user1.id,{status:"Active"})
    res.render("auth/confirmation",{user1});
  })
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = authRoutes;
