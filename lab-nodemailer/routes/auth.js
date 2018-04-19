const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const transporter = require("../mail/transporter");

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
  const email = req.body.email;
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

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmationCode = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: encodeURIComponent(hashConfirmationCode)
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        transporter
          .sendMail({
            from: '"My Awesome Project 👻" <myawesome@project.com>',
            to: newUser.email,
            subject: "1234567 Risto",
            text: newUser.username,
            html: `<b>This is your confirmation code: ${
              newUser.confirmationCode
            }</b>`
          })
          .then(info => console.log(info))
          .catch(error => console.log(error));

        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/confirm/:confirmCode", (req, res, next) => {
console.log(`My param is: ${req.params.confirmCode}`)
let myParam = req.params.confirmCode
User.findOneAndUpdate({confirmationCode:encodeURIComponent(myParam)},{'status' : 'Activated'})
.then( res.redirect("/"))


// User.findOne({'confirmationCode' : myParam})
// .then((data) => {
//   console.log(data);
// })

  //res.redirect("/");
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
