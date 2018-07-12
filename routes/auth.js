const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const mySendMailFunction = require("../mailing/sendMail.js");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const {username, password, email} = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (!email.includes('@')) {
    res.render("auth/signup", { message: "You have to indicate a valid email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConf = encodeURIComponent(bcrypt.hashSync(username, salt));

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConf,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        const urlConf = `http://localhost:3000/auth/confirm/${hashConf}`;
        mySendMailFunction(email, urlConf);
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/confirm/:hashConf", (req, res) => {
  const code = encodeURIComponent(req.params.hashConf);
  User.findOneAndUpdate({confirmationCode: code}, {status: 'Active'}, (err) =>{
    if (err) {
      console.log("update falló ohhhhh!")
    }
    else {
      User.findOne({confirmationCode : code})
      .then((user) => {
      res.render("auth/confirmation", {username: user.username});
      })
    }  
  })
})

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/profile", (req, res, next) => {
  User.findOne({_id : req.session.passport.user})
  .then((user) => {
    res.render("auth/profile", {user});
  })
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;