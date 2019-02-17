const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
let {sendActivationMail} = require('../helpers/mailer')
const {isActive} = require('../helpers/middlewares')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


//Middleware Loggedin

function isLoggedIn(req,res,next){
  //if(req.session.currentUser){
  if(req.isAuthenticated()){
    next()
  }else{
    res.send('Content not for you')
  }
}

//Create confirmation code
function generateCode(){
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
  }
  return token;
}

//Testing a private page in case there is a logged user with an active account
router.get('/private', isLoggedIn, isActive('Active'), (req,res)=>{
  res.render("private")
})

//Confirmation route

router.get('/confirm/:confirmCode', (req,res,next) =>{
  let confirmCode = req.params.confirmCode
  console.log('jola')
  User.findOneAndUpdate({confirmationCode:confirmCode}, {$set: {status:'Active'}},{new:true})
      .then(r=> res.render('auth/confirmation'))
      .catch(e=>next(e))
})



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
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.render("auth/signup", { message: "Indicate email and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username / email provided already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    let confirmationCode = generateCode()

    const newUser = new User({
      username,
      email,
      confirmationCode,
      password: hashPass
    });


    let data = {
      name: username
    }
  
    newUser.save()
    .then(() => {
      res.render('confirm', data)
      console.log({newUser})
      sendActivationMail(username,email,confirmationCode)
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

module.exports = router;
