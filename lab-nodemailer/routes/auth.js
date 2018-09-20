const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require('../helpers/mailer').sendMail


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
  if (username === "" || password === "" | email==="") {
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

    const saltConf = bcrypt.genSaltSync(bcryptSalt);
    const hashPassConf = bcrypt.hashSync(username, saltConf);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: hashPassConf
    });

    newUser.save()
    .then(() => {
      sendMail(newUser.email, newUser.confirmationCode )
      res.render("please");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

//middleware
const isLoggedIn = (req,res,next) => {
  if(req.isAuthenticated()){
   return next();
  }
  else 
    res.redirect('/auth/login')
}

//confirm email
router.get('/confirm', (req,res,next)=>{
  const {code} = req.query

  console.log("Code: " + code)
  User.findOneAndUpdate({confirmationCode: code},{$set:{status: 'Active'}},{new:true},(err,user)=>{
    res.render('verified',user)
  })

})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render('profile',req.user )
});



module.exports = router;
