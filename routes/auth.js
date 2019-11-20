const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const mailer = require('../configs/nodemailer.configs')


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
  const { username, password, email, status } = req.body

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  User.create({ username, password, email, confirmationCode, status })

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
      confirmationCode,
      status
    });

    newUser.save()
      .then(() => {
        mailer.sendMail({
          from: '"alebecca" <noreply@alebcca.com',
          to: email,
          subject: "Welcome to alebecca Inc.",
          text: `Welcome to alebecca Inc. Please verify this email throught this link: http://localhost:3000/auth/confirm/${confirmationCode}`
        })
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get('/confirm/:confirmCode', (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, {status: "Active"})
    .then(user => {
      // let message = ""
      // if (req.params.confirmCode === confirmationCode) {
      //   status = "Active"
      // }
      // else {
      //   message = "Wrong code, you messed up!!"
      // }

      res.render('auth/confirmation')
    })
    .catch(err => { console.log(err) })
})

router.get("/profile", (req, res) => {
  User.findOne()
    .then(oneUser => res.render("auth/profile", {
      user: oneUser
    }))
    .catch(err => console.log("error", err))
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
