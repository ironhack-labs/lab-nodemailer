const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

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
    const hashConf = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConf
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        console.log("We should send email now")

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD
          }
        });
      
        let message = `Please click on <a href='http://localhost:3000/auth/confirm/${hashConf}'>this link</a>.`
      
        let subject = "Email confirmation"
    
        transporter.sendMail({
          from: '"Signup Test Project" <process.env.GMAIL_EMAIL>',
          to: email, 
          subject: subject, 
          // text: message,
          html: `<b>${message}</b>`
        })
        .then(info => { 
          res.render('message', {email, subject, message, info});
          console.log("email sent!")
          res.redirect("/");
        })
        .catch(error => console.log(error));
      }
    });
  });
  
});


authRoutes.get("/confirm/:confirmCode", (req, res, next) => {

  User.findOne({ confirmationCode: req.params.confirmCode })
  .then((user) => {
    console.log(user)
    user.status = "Active"
  // NEed to save to DB! is this all??? Promise??
    user.save()
    .then( res.redirect(`/profile/${user._id}`))
  })
  .catch((error) => {
    console.log(error)
  })
});



authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
