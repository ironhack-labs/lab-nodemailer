require("dotenv").config({ path: ".env" });
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  console.log(process.env.GMAILUSER);
  console.log(process.env.PASSW);

  // const confirmationCode = req.body.username;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate username, password and email"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = encodeURI(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      email,
      confirmationCode,
      password: hashPass
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.PASSW
      }
    });

    transporter
      .sendMail({
        to: email,
        subject: "Please confirm your email",
        text: "Confirm your email to use our site!",
        html: `<p>http://localhost:3000/auth/confirm/${confirmationCode}</p>`
      })
      .then(
        info => console.log(info)
        // res.render('message', {email, subject, message, info})
      )
      .catch(error => console.log(error));
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  let conCode = req.params.confirmationCode;
  User.findOneAndUpdate({confirmationCode: conCode}, {status: "Active"})
  .then(resolution => {
    res.render("auth/confirmation", {resolution})
  })
  .catch(error => {
    console.log(error)
  })
})

router.get('/profile', (req,res,next) => {
  User.findOne(req.user)
  .then(user => { 
    res.render("profile", {user})
  })
})

module.exports = router;

