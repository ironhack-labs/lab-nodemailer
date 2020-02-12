const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const mailer = require("../configs/nodemailer.config")


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
  const { username, password, email } = req.body

  if (username === "" || password === "")
  {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null)
    {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = {
      username,
      password: hashPass,
      email,
      confirmationCode: getConfirmCode()
    }

    User.create(newUser)
      .then(() => res.redirect("/"))
      .then(() => {
        let enlace = `<a href="http://localhost:3000/auth/confirm/${newUser.confirmationCode}">Pincha aqui para confirmar</a>`
        let text = `localhost:3000/auth/confirm/${newUser.confirmationCode}`
        mailer.sendMail({
          from: '"Ironhacker Email 👻" <myawesome@project.com>',
          to: newUser.email,
          subject: "subject",
          text: text,
          html: enlace
        })
          .then(info => res.render('email-sent', { email, subject, message, info }))
          .catch(error => console.log(error));
      })
      .catch(err => res.render("auth/signup", { message: "Something went wrong" }))
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

router.get("/confirm/:confirmCode", (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmCode })
    .then(user => User.findByIdAndUpdate(user._id, { status: "Active" }))
    .then(user => res.redirect(`/auth/profile/${user._id}`))
    .catch(err => console.log(err))
})

router.get("/profile/:id", (req, res) => {
  console.log(req.params.id)
  User.findById(req.params.id)
    .then(user => res.render("./auth/profile", user))
    .catch(err => console.log(err))
})



function getConfirmCode() {

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0;i < 25;i++)
  {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}

module.exports = router