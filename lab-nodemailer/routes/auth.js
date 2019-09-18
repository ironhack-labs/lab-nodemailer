const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const secure = require('../middlewares/secure.mid');
const randToken = require('rand-token')
const transporter = require('../configs/modemailer.config')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/private",
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
    res.render("auth/signup", { message: "Indicate username, password and email." });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "This username already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const confirmationCode = randToken.generate(30);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser.save()
    .then(() => {
      transporter.sendMail({
        from: '"TULIPÁN" <jesusfakerking@gmail.com>',
        to: email, 
        subject: "Confirmation mail", 
        text: "Confirm",
        html: mailText(token)
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

router.get("/private", secure.checkLogin, (req, res, next) => {
  res.render('auth/private', { user: req.user });
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
