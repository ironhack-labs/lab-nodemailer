const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//nodemailer
const nodemailer = require('nodemailer');

//Cloudinary 
// const multer = require('multer');
const uploadCloud = require('../config/cloudinary');


const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

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

router.post("/signup",uploadCloud.single('photo'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const path = req.file.url;
  const originalName = req.file.originalname;

  function generateConfirmationCode(){
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
    return token;
  }

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
      username,
      email,
      password: hashPass,
      path,
      originalName,
      confirmationCode: generateConfirmationCode()
    });

    newUser.save()
      .then(user => {
      const linkVerify = `http://localhost:3000/auth/confirm/${user.confirmationCode}`
      console.log(user);
  //firing the email
      transport.sendMail({
        from: '"Jon Snow App" <noreply@got.com>',
        to: user.email,
        subject: 'Welcome to GoTApp',
        text:`Welcome ${username}`,
        //  html: `Welcome!, confirm your account here http://localhost:3000/auth/confirm/${user.confirmationCode}`,
        html: `<a href='${linkVerify}'>Click here to confirm your account </a>`,
      })
        .then(info => {
          console.log(sendMail)
          console.log(info)
          res.render('auth/verifyemail');
        })
        .catch(error => res.render('auth/signup', {
          errorMessage: error

        })
        
      )})
    .catch(err => res.status(400).render('auth/signup', {
      errorMessage: err.errmsg
    }));

  });
});


router.get('/confirm/:confirmationCode', (req, res) => {
  const { confirmationCode } = req.params;


  User.findOneAndUpdate({ confirmationCode: confirmationCode }, { $set: { status: 'Active' } }, { new: true })
    .then(response => { 
      console.log(response)
    res.render("confirmation", {response});
  })
    .catch(error => console.log(error));
})


//profile route

router.get('/profile', ensureLogin.ensureLoggedIn(),(req, res) => {
  res.render('profile', {user: req.user});
});

//confirmation

router.get('/confirmation',(req, res) => {
  res.render('confirmation');
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;




