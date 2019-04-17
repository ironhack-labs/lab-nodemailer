const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
  
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = token; 

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
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
      });
      transporter.sendMail({
        from: '"Minchione" <bill.gates@ironhack.com>',
        to: email, 
        subject: "Confirm your account", 
        text:  `http://localhost:3000/auth/confirm/${confirmationCode}`,
        html: `<p>http://localhost:3000/auth/confirm/${confirmationCode}</p>`
      })
      .then()
      .catch(err => {
        res.render("auth/signup", { message: "Email not send" });
      });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// router.get("/confirm/:confirmCode", (req, res, next) => {
//   let confirmCode = req.params.confirmCode;
//   User.findOne({ confirmationCode : confirmCode }) 
//   .then(() => res.render('auth/confirmation'))
//   .catch((err) => {
//     next(err);
//   })
// });

router.get('/confirm/:confirmCode', (req, res, next) => {
  let confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode : confirmCode }, {status: "Active"})
  .then(() => res.render('auth/confirmation'))
  .catch((err) => {
    console.log(err);
  })
});

module.exports = router;
