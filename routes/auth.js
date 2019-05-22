const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../email/sendMail")
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const middlewareConfirCode = require("../middleware/confirCode");

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
let confirmationCode = ""

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username,password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const characters = 'jfvodhidugfpu9pr70r8778pou1234sdfghjSDFGHJKPOIUYTRE'
    for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length)]
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
      .then((user) => {
        const url = `http://localhost:3000/auth/confirm/${confirmationCode}&${username}`
        const subject = "Your verification code"
        const message = `this is your confirmation code: ${confirmationCode}<br><a href="${url}">verifica tu cuenta aqui</a>`
        sendMail(user.email, subject, message)
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


router.get("/confirm/:confirmCode", (req, res) => {
  console.log("el param es", req.param)

  console.log("YAY!")
  User.findOneAndUpdate({ confirmationCode }, { status: "active" })
    .then(user => res.render("auth/confirm"))
    .catch(err => console.log(err))

})



router.get("/profile", middlewareConfirCode("/auth/login"), (req, res) => {
  const logUser = req.user;
  res.render("auth/profile", { logUser })
}
)

module.exports = router;
