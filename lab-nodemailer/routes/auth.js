const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  const email = req.body.email;
  const password = req.body.password;
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

    let token = "";
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }

    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: token
    });

    newUser.save()
    .then(() => {
      //Send code 
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: `${process.env.MAILFROM}`,
            pass: `${process.env.MAILPASS}`
        }
      });
      
      let host=req.get('host');
      let verificationLink="http://"+req.get('host')+"/auth/confirm/"+token;

      transporter.sendMail({
        from: `${process.env.MAILFROM}`,
        to: email, 
        subject: "Please confirm your Email account", 
        text: 'Awesome Message',
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+verificationLink+">Click here to verify</a>"
      })
      .then(info => console.log(info))
      .catch(error => console.log(error));
      //Send code
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get('/confirm/:confirmCode',(req,res)=>{

  let confirmToken = req.params.confirmCode;
  let filterParam = {confirmationCode:{$eq:confirmToken}};
  User.findOne(filterParam).select({status:1})
  .then((status)=>{
    let idConfirmed = status._id;
    User.findByIdAndUpdate(idConfirmed, {status:"Active"})
    .then(result => {
      console.log(result);
      res.render("auth/login", { message: "Profile verified." });
    })
  })
  .catch(
    res.redirect("/")
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
