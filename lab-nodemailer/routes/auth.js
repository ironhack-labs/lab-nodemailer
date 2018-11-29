const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const {welcomeMail} = require('../helpers/mailer')

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
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    //const salt = bcrypt.genSaltSync(bcryptSalt);
    //const hashPass = bcrypt.hashSync(password, salt);



      User.register(req.body,password)
          .then(user => {
              welcomeMail(req.body.email, "Bienvenido! Te registraste correctamente ")
              res.json(user);
          })
          .catch(e => next(e));

  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:token"){
  const token
}

module.exports = router;
