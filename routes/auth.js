const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'charlottetreuse42@gmail.com',
    pass: process.env.gmail
  }
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

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
  const email = req.body.email;
  const password = req.body.password;
  const status = "Pending Confirmation"
  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
      status,
      confirmationCode : makeid()
    });

    newUser.save()
    .then((user) => {
      transporter.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: "Confirmation of email", 
        text: `Please click on the link to verify your account: http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        html: `Please click on the link to verify your account: <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">http://localhost:3000/auth/confirm/${user.confirmationCode}</a>`
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))
    
      res.render("message", {email});
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});


router.get("/confirm/:confirmCode", (req,res,next)=> {
let confirmCode = req.params.confirmCode
  User.findOneAndUpdate({confirmationCode: confirmCode}, {status:"Active"})
  .then (user => {
    res.render("confirmation", {user})
  })

})

router.get("/profile/:id", (req,res,next)=> {
let id = req.params.id
  User.findById(id)
  .then (user => {
    res.render("profile", {user})
  })

})

router.get("/profile", (req,res,next)=> {
  console.log("User:", req.user)
    User.findById(req.user._id)
    .then (user => {
      res.render("profile", {user})
    })
  
  })

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
