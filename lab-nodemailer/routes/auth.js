const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const nodemailer = require("nodemailer");

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

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token
    });

    console.log(email);

    newUser
      .save()
      .then(() => {
        res.redirect("/");
        transporter
          .sendMail({
            from: '"My Awesome Project " <myawesome@project.com>',
            to: email,
            subject: "Awesome Subject",
            text: "Awesome Message",
            html: "<b>http://localhost:4000/auth/confirm/" + token + "</b>"
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));
      })
      .catch(err => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vicbansax@gmail.com",
        pass: process.env.PWD
      }
    });
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmCode }).then(user => {
    if (user !== null) {
      User.findByIdAndUpdate(user._id, { status: "Active" }).then(user =>
        res.render("auth/confirmation", { user })
      );
      return;
    }
    res.redirect("/auth/signup");
  });
});

router.get("/profile/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    console.log(user)
    res.render("auth/profile"), {user};
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
