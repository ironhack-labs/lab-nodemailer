const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("./../models/User");

// import mail text
const mailText = require('../templates/mailText')

// NodeMailer import
const transporter = require('../configs/nodemailer.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const randToken = require('rand-token');


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
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
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }).then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const confirmationCode = randToken.generate(25);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode,
      email,
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
          from: '"tuputamadre" <tastuquevoy25@gmail.com>',
          to: email,
          subject: "Confirmation mail",
          text: "Confirm",
          html: `<a href="http://localhost:3000/auth/activation/${randToken}">¡Confirma tu cuenta hijo puta!</a>`
          // html: mailText(randToken)
        })
          .then(info => console.log(info))
          .catch(error => console.log(error));

        res.redirect("/");
      })
      .catch(err => {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { $set: { active: true } }, { new: true })
    .then((user) => {
      res.render("auth/activation", { user })
    }).catch(() => {
      console.log("A ocurrido un error de activacion")
    })
})
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
