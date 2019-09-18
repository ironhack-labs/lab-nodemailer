const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const templates = require("../templates/template");
const router = express.Router();
const User = require("../models/User");
const secure = require("../middleware/secure.mid");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASS}`
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
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
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Indicate email, username and password"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
  });


  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const newUser = new User({
    email,
    username,
    password: hashPass,
    status: "Pending Confirmation",
    confirmationCode: token
  });

  newUser
    .save()
    .then(() => { 
      transporter.sendMail({
        from: "Natalia 🦄",
        to: email,
        subject: "Confirmation email",
        text: "Confirmation email",
        html: templates.templateExample(token, username)
      });
    })
    .catch(err => {
      console.log(err)
      res.render("auth/signup", { message: "Something went wrong" });
    });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  const confirmCode = req.params.confirmCode;
  User.findOne({ confirmationCode: confirmCode })
  .then(
    User.update({ confirmationCode: confirmCode }, {
      $set: {
        status: 'Active'
        }
    })
    .then(res.render("auth/confirmation"))
  ).catch( (err) => console.log(err));
});

router.get("/profile", secure.checkStatus, (req, res, next) => {
  User.findById(req.user.id)
  .then(user => {
    res.render("auth/profile", { user, isActive: req.user.status === "Active" });
  })
  .catch(err => next(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
