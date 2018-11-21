const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const mailer = require('../helpers/mailer');

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
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirm = bcrypt.hashSync(username,salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirm
    });

    newUser.save()
    .then(() => {
        let options = {
          to: email,
          subject: 'Iron Confirmation Email',
          filename: 'verify',
          message: `http://localhost:3000/auth/confirm/${hashConfirm}`,
          user: username
        };
        mailer.send(options)
            .then(() => {
                res.status(200).send('Please confirm your email with the mail that we sent you!');
            })
            .catch((error) => {
              console.log(email + username + ' are wrong');
              res.status(500).json({error, "Proble": "There was a problem with the email"})
            })
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

module.exports = router;
