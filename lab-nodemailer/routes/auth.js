const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  const password = req.body.password;
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    let code = token;
    User.findOne({
      token
    }, "confirmationCode", (err, token) => {
      if (user !== null) {
        res.render("auth/signup", {
          message: "There is an error creating the confirmation token, try again"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      console.log(token);
      const newUser = new User({
        username,
        password: hashPass,
        status: 'Pending Confirmation',
        confirmationCode: code,
        email: email
      });

      newUser.save()
        .then((user) => {
          console.log(user);
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS 
            }
          });

          transporter.sendMail({
            from: `"My Awesome Project"<${process.env.GMAIL_USER}>`,
            to: user.email, 
            subject: 'Activate', 
            text: 'Activate your account',
            html: `<a href="http://localhost:3000/activate/${user.confirmationCode}">Activate account</a>`
          })
          .then(info => res.redirect("/"))
          .catch(error => console.log(error))
        })
        .catch(err => {
          res.render("auth/signup", {
            message: `Something went wrong ${err}`
          });
        })
    })

  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;