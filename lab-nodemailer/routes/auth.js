const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const { sendConfirmationCode } = require('../config/nodemailer')

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

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const confirmationCode = token

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Fill data" });
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
        sendConfirmationCode(
          email,
          `
          <div style="
          text-align: center;
          background: white;
          color: #585858;
          font-family: helvetica;">
            <img src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4017/s200/logo-ironhack-blue.png" alt="Logo Ironhack">
              <h1>Ironhack Confirmation Email</h1>
              <h3>Hello ${username}</h3>
              <p>Thanks to join our community! Please confirm your account clicking on the following link</p>
              <a href="http://localhost:3000/auth/confirm/${confirmationCode}" target="_blank">Confirm</a>
            </div>
          `,
          username)
          .then(() => res.render('auth/mail'))
          .catch(err => res.render('auth/mail'))
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  const { confirmCode } = req.params
  User.findOneAndUpdate({ confirmationCode: confirmCode }, { $set: { status: "Active" } }, { new: true })
    .then((data) => {
      res.render('auth/confirmation', data)
    })
    .catch(err => res.send(err))
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile/:id", (req, res, next) => {
  const { id } = req.params

  User.findById(id)
    .then(user => {
      res.render("auth/profile", user);
    })
    .catch(err => {
      res.render("auth/profile", err);
    });
});

module.exports = router;
