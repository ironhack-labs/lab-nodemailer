const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const sendMail = require("../mailing/sendMail");

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

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
    const hasUsername = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: encodeURI(hasUsername),
      email
    });
    console.log(newUser);
    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        let link = `http://localhost:3000/auth/confirm/${encodeURI(
          hasUsername
        )}`;
        console.log(link);
        sendMail(email, link).then(() => {
          res.redirect("/");
        });
      }
    });
  });
});

authRoutes.get("/confirm/:confirmationCode", (req, res, next) => {
  const { confirmationCode } = req.params;

  User.findOne({ confirmationCode })
    .then(user => {
      return User.findByIdAndUpdate(user._id, { status: "Active" });
    })
    .then(user => {
      res.render("auth/confirmation", { user });
    })
    .catch(err => next(err.message));
});


authRoutes.get("/profile", (req, res) => {
  res.render("auth/profile");
  
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
