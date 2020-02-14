const express = require("express");
const passport = require('passport');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require("../models/User");

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

    //Token generation:
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token
    });

    newUser.save()
    .then(() => {
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
      transporter.sendMail({
        from: '"Nodemailer Test App " <ironhack.test.no.reply@gmail.com>',
        to: newUser.email, 
        subject: "Your confirmation code", 
        text: `
              Hi, ${newUser.name}
              To complete your registration, please follow this link:
              http://localhost:3000/auth/confirm/${newUser.confirmationCode}
              `,
        html: `
              <h2>Hi, ${newUser.username}</h2>
              <p>To complete your registration, please follow this link: </p>
              <p>http://localhost:3000/auth/confirm/${newUser.confirmationCode}</p>
              `
      })
      .then(() => res.redirect("/"))
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  User.findOne({confirmationCode: req.params.confirmCode})
  .then(user => {
    return User.findOneAndUpdate({ _id: user._id }, { $set: {status: 'Active' }})})
  .then(updatedUser => res.render('auth/confirmation', {updatedUser}))
  .catch(err => res.render('auth/confirmation', {err}))
});

module.exports = router;
