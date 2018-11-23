const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const transporter = require("../mail/transporter");
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
const characters =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let token = "";
for (let i = 0; i < 25; i++) {
  token += characters[Math.floor(Math.random() * characters.length)];
}
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = token;

  console.log(confirmationCode);

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
      email,
      confirmationCode
    });
    newUser.save().then(() => {
      transporter
        .sendMail({
          from: '"My Awesome Project 👻" <jorgedevesa.ironhack@gmail.com>',
          to: email,
          subject: username,
          text: "Heeey",
          html:`<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirmation</a>`
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          res.render("auth/signup", { message: "Something went wrong" });
        })
        .catch(err => {
          res.render("auth/signup", { message: "Something went wrong" });
        });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res, next)=>{
  User.findOneAndUpdate({confirmationCode: req.query.confirmCode}, {$set:{status:'Activate'}})
  .then(()=>console.log(req.query.confirmCode))
  .then(user => res.render("auth/confirmation", { message: "The username already exists" }))
  .catch(err => { next(err) })
});

module.exports = router;