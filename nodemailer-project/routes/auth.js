const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
require('dotenv').config()
const nodemailer = require('nodemailer')

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
  const { username, email, password } = req.body;
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
        token += characters[Math.floor(Math.random() * characters.length )];
    }
    const newUser = new User({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token,
      status: "Pending Confirmation"
    });
    newUser.save()
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
    let transporter = nodemailer.createTransport({
      service:"Gmail",
      auth: {
        user: 'ironlabs011@gmail.com',
        pass: process.env.MAIL,
      }
    });
    transporter.sendMail({
      from: 'Toritos guapos',
      to: email,
      subject: "Wellcome to Las Vegas",
      text: `Hola ${username}, Rosalía mola mucho Trátrá confirma tu mail en el URL http://localhost:3000/auth/confirm/${token}`,
      html: `<b>Hola ${username}, Rosalía mola mucho Trátrá confirma tu mail con el código http://localhost:3000/auth/confirm/${token}</b>`
    })
    .then()
    .catch(error => console.log(error));
    })
  });

router.get("/confirm/:token", (req, res)=> {
  
  const { token } = req.params;
  if (User.find({confirmationCode: token})) {
    User.findOne({confirmationCode: token})
      .then(user=> user.update({status: "Active"}))
      .catch(err => console.error(err))
  }
  res.redirect("/")
})
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/:id", (req, res) => {
  const { id } = req.params
  User.findById(id)
    .then(user => res.render("protected/profile", user))
    .catch(err => console.error(err))
})

module.exports = router;
