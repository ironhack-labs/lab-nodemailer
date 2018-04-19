const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const sendMail = require("../mail/sendMail");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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
    let hashConfirmationCode = bcrypt.hashSync(username, salt)
    hashConfirmationCode = hashConfirmationCode.replace(/\//g,'')

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirmationCode
    });

    console.log(newUser.confirmationCode)

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        sendMail("pepe.ironhack@gmail.com", newUser.confirmationCode).then(
          () => {
            req.flash("info", "Mensaje enviado");
            res.redirect("/");
          }
        );
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
  let confirm = req.params.confirmCode;
  //console.log(confirmationCode);

  User.findOneAndUpdate({"confirmationCode":confirm}, { status: "active" })
    .then( user => {
      console.log(user)
      if (user === null) {
        console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrr")
        res.redirect("/auth/signup");
      } else {
        res.render("auth/confirmation", user);
      }
    })
    .catch(err => console.log(err))
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
