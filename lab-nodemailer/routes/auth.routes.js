const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../configs/nodemailer.config')

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
  const email = req.body.email
  const confirmationCode = generateCode()
  const message = `Hello ${username} here's your confirmation code link: http://localhost:3000/auth/confirm/${confirmationCode}`

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

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode
    });


    mailer.sendMail({
      from: '"Ironhack Nodemailer 👻" <myawesome@project.com>',
      to: email,
      subject: "Here's your confirmation code for your iron account",
      text: message,
      html: `<b>${message}</b>`
    })
      .then(() => console.log(username, password, confirmationCode, email, message))
      .catch(error => console.log(error));

    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function generateCode() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}

router.get("/confirm/:token", (req, res) => {
  const token = req.params.token
  User.findOneAndUpdate({ confirmationCode: token }, { status: 'Active' })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


const checkRole = type => (req, res, next) => type.includes(req.user.status) ? next() : res.render("index", { roleErrorMessage: `Necesitas ser  ${type} para acceder aquí` })

router.get('/profile', checkRole(['Active']), (req, res) => res.render('auth/profile'))


module.exports = router;
