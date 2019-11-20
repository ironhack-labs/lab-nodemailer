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
  const email = req.body.email;

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const confirmationCode = token

  //bloque num aleatorio

  if (!username || !password || !email || !confirmationCode) {
    res.render("auth/signup", { message: "Indicate all the details" });
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

    newUser.save()
      .then(() => {
        message = `please copy this code ${confirmationCode}`
        mailer.sendMail({
          from: '<aaapopinno@gmail.com>',
          to: email,
          subject: "your confirmation code",
          text: `http://localhost:3000/auth/confirm/${confirmationCode}`,
          html: `<b>http://localhost:3000/auth/confirm/${confirmationCode}</b>`
        })
          .catch(error => console.log(error));
      })
    res.redirect("/");
  })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmationCode', (req, res) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmationCode }, { status: `active` })
    .then(x =>
      res.render("confirm"))
    .catch(err => { console.log("algo fue mal") })
}
)


module.exports = router;


