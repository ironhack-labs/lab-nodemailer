const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

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
router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmCode })
    .then((user) => {
      if (user.confirmationCode == req.params.confirmCode) {
        res.render("auth/confirmation", { message: "Everything is okay" })
      }
      return
    })

    .catch(error => console.log(error))
})

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
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    };

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token,
    });

    newUser.save()
      .then(() => {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'pruebanodemailer0119@gmail.com',
            pass: 'Prueba-nodemailer-0119'
          }
        });
        
        // let transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //     user: 'krlslaberto13@hotmail.com',
        //     pass: process.env.PWD
        //   }
        // })
        
        transporter.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: email,
          subject: "nuevo usuario",
          text: "hollllla",
          html: `<b style='color:red'>hollllla</b>`
        })
        console.log("----lllllll")
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
