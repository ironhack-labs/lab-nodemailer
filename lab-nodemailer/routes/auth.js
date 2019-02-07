const express = require("express");
const passport = require('passport');
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptRounds = 10;


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.gmailemail,
    pass: process.env.gmailpassword
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.get("/profile", (req, res, next) => {
  console.log(req.user)
  res.render("auth/profile", {user: req.user});
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
    token += characters[Math.floor(Math.random() * characters.length )];
  }

  let {username, password, email} = req.body;

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username or Email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: hashPass,
      confirmationCode: token,
      email
    })
    .then(() => {
      transporter.sendMail({
        from: '"My Awesome Project 👻" <charlotte.treuse7fff00@gmail.com>',
        to: email, 
        subject: "Confirmation", 
        text: `
          Confirm here http://localhost:3000/auth/confirm/${token}
        `
      });

      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    });
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  let code = req.params.confirmCode;
  User.findOne({"confirmationCode": code})
  .then((user) => {
    User.findByIdAndUpdate(user._id, {status: "active"})
    .then(user => {
      res.render("auth/confirmation", {user, result: "success"});
    })
    .catch(err => console.log(err));
    // user.status = "active";
  })
  .catch(err => {
    res.render("auth/confirmation", {result: "error"});
    console.log(err);
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;