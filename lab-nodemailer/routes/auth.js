const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const mailer = require('../configs/nodemailer.config')

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
  
  const { username, password, email } = req.body
  
  if (username === "" || password === "" || email == "") {
    
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  
  User.findOne({ username }, "username", (err, user) => {
    console.log({username})
    if (user !== null) {
      res.render("auth/signup", { message: "The user already exists" });
      return; 
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    

    function getToken() {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i++) {
          token += characters[Math.floor(Math.random() * characters.length )];
      }
      return token
    }

    const confirmationCode = getToken()


    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });
    
    
    newUser.save()
    .then(() => {
      
      mailer.sendMail({
        from: '"Ironhacker Email 👻" myawesome@project.com',
        to: email,
        subject: "Welcome to our new service!!!",
        text: `http://localhost:3000/auth/confirm/${confirmationCode}`,
        html: `<b>http://localhost:3000/auth/confirm/${confirmationCode}</b>`
      })
      .then ( x => res.redirect("/"))
      // .then(info => res.render('email-sent', { email, subject, message, info }))
      .catch(error => console.log(error));
    })
    
    
  })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
// });

router.get("/confirm/:confirmationCode", (req, res) => {
    User.findOneAndUpdate({confirmationCode: req.params.confirmationCode},{status: 'active' })
    .then ( x =>
      res.render("auth/confirmation")
    )
    .catch(error => console.log(error));

        })

router.get("/profile", (req, res, next) => {
          res.render("auth/profile",{user:req.user});
        });



router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
