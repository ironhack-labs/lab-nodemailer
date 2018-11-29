const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function sendVerificationEmail(email,verifcode,username){
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pacheco.sga@gmail.com',
      pass: process.env.GMAILPWD
    }
  })

  transporter.sendMail({
    from: 'Holi <pacheco.sga@gmail.com>',
    to: email, 
    subject: 'Welcome '+username, 
    text: 'http://localhost:3000/auth/confirm/'+verifcode,
    html: 'http://localhost:3000/auth/confirm/'+verifcode
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}

router.get('/confirm/:confirmCode', (req,res,next)=>{
  User.updateOne({'confirmationcode':req.params.confirmCode},{'status':'Active'})
  .then(() => {
    res.redirect('/auth/login')
    //User.findOne({'confirmationcode':req.params.confirmCode})
  })
  .catch(err => {
    console.log(err)
  })
})


router.get('/profile',(req,res,next)=>{
  if(req.isAuthenticated()){
    res.render('profile', req.user)
  }else{
    res.redirect('/auth/login')
  }
  //res.send(req.user)
  //res.send(req.isAuthenticated())
})

router.get("/login",(req, res, next) => {
  if(req.isAuthenticated()){
    res.render('profile', req.user)
  }else{
    res.render("auth/login", { "message": req.flash("error") })
  }
  
});

router.post("/login", passport.authenticate("local", {
  //successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}), (req,res,next)=>{
  res.render('profile', req.user)
})

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';
    for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
    }
  const conf_code = token
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

    const newUser = new User({
      username:username,
      password: hashPass,
      email:email,
      confirmationcode:conf_code,
      status:'Pending confirmation'
    });
    console.log(conf_code)
    sendVerificationEmail(email,conf_code,username)
    newUser.save()
    .then(() => {
      
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  if(req.isAuthenticated()){
    req.logout();
    res.redirect("/auth/login");
  }else{
    res.redirect("/");
  }

});

module.exports = router;
