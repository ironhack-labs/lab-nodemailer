const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {welcomeMail} =require('../passport/mailer')
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
 const random = function(){
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}
return token
}
 router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
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
    let token = random()
     const newUser = new User({
      username,
      password: hashPass,
      email:email,
      confirmationCode:token
    });
     newUser.save()
    .then(user => {
      
      welcomeMail(user.email, user.confirmationCode)
       confirm = user.confirmationCode
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});
router.get('/confirm/:confirmCode',(req,res,next)=>{
  const {confirmCode} = req.params
  
    console.log("Este la confirmacion" + confirmCode)
    User.findOneAndUpdate({confirmationCode:confirmCode},{$set: { status: 'active' }},(err,user)=>{
      
    })
     res.render("confirmation")
    
   
  
})
 router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
 module.exports = router;