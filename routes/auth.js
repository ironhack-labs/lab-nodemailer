require('dotenv').config()
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const user = process.env.EMAIL;
const pass = process.env.PASS;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass
  }
});

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
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = req.body.confirmationCode
  console.log("hola")
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
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
          // from: 'ironhack@pruebas.com' , // sender address
          // to: newUser.email,
          from: 'martaguirre91@gmail.com',
          to: 'martaguirre91@gmail.com',
          subject: "Hello ✔", // Subject line
          html: `<h1>Hello its working! Hi ${newUser.username}</h1>
        http://localhost:3000/auth/confirm/${newUser.confirmationCode}`
        })
          .then(info => {
            console.log(info)
            res.redirect("/")
          })
          .catch(error => console.log(error))
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  })


});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  console.log("entro aqui")
  const confirmationCode = req.body.confirmationCode
  console.log(confirmationCode);
  
  User.findOne({ "confirmationCode": req.params.confirmationCode })
    .then(user => {
      if (user) {
        user.status = 'Active';
        user.save()
          .then(user => {
            console.log(user)
            res.render('auth/confirmation', user )
          })
          .catch(e => next)
      } else {
        res.render('users/login')
      }
    })
    .catch(e => next)
})


router.get("/myProfile/:username", (req, res, next) => {
  console.log("hola")
  User.findOne({ "user": req.params.username })
    .then(user => {
      if (user) {
        user.status === 'Active' ?   res.render('myProfile', {user}) : res.send("confirm your email")

      } else {
        res.render('users/login')
      }
    })
    .catch(e => next)
  res.render('myProfile', {user})
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
