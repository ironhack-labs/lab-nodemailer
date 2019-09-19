const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// import mail text
const mailText = require('../templates/mailText')


let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

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

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate all fields" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: token,
    });

    newUser
      .save()
      .then(() => {
        transporter
          .sendMail({
            from: '"Pablo" <pablogiralironhack@gmail.com>',
            to: "pablogiralironhack@gmail.com",
            subject: "Greetings from the Nigerian Prince",
            text: "Confirm",
            html: `http://localhost:3000/auth/confirm/${token}`
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));

        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:confirmationCode", (req, res) => {
  User.findOneAndUpdate({confirmationCode:req.params.confirmationCode},{$set:{status:"Active"}},{new: true})
  .then((user)=>{
    res.render("auth/activation",{user})
  }).catch(()=>{
    console.log("Error de activacion")
  })
})


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
