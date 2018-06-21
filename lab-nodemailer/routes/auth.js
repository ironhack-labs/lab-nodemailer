const express = require("express");
const passport = require('passport');
const nodemailer = require('nodemailer');
const authRoutes = express.Router();
const User = require("../models/User");
require("dotenv").config();


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
  const { username, email, password } = req.body;
  const role = req.body.role;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const salt2 = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt2);


    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirmation,
      role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong"})
      
      } else {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
          }
        });
        transporter.sendMail({
          from: `"We are awesome" ${process.env.GMAIL_EMAIL}`,
          to: email, 
          subject: "your new account with BhavLaGio", 
          // text: "here is you confirmation code: ",
          html: `Confirmation code: http://localhost:3000/auth/confirm/${hashConfirmation}`
        })
        res.redirect("/");
      }
    });
  
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res) => {
  //let confirmCode = something like mongoose.req or ...?
  //mongoose, database stuff i guess? HAve to GET the hash from the data
  res.render("auth/signup")
})

/* 
  authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
}); */


// authRoutes.post('/send-email', (req, res, next) => {
//   let { email } = req.body;
//   let transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.GMAIL_EMAIL,
//       pass: process.env.GMAIL_PASSWORD,
//     }
//   });
//   transporter.sendMail({
//     from: `"We are awesome" ${process.env.GMAIL_EMAIL}`,
//     to: email, 
//     subject: "your new account with BhavLaGio", 
//     // text: "here is you confirmation code: ",
//     html: `<b>Confirmation code: <a>${confirmationCode}<a></b>`
//   })
//   .then(info => res.render('auth/signup', {username, confirmationCode}))
//   .catch(error => console.log(error));
// });





authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
