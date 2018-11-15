const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const sendEmail = require("../mail/sendEmail");

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
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const username = req.body.username;
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const email = req.body.email;

  const confirmationCode = bcrypt.hashSync(username, salt);

  if (username === "" || req.body.password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });
    console.log(newUser);

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        //enviar el email
        sendEmail(newUser.email, newUser.confirmationCode)
          .then(() => {
            console.log("MENSAJE ENVIADO... ¿ O NO?");
            res.redirect("/");
          })
          .catch(err => next(err));
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/confirm/:confirmCode", (req, res) => {
  let confirmationCode = req.params.confirmCode;

  User.findOneAndUpdate(
    { confirmationCode },
    { status: "Active" },
    (err, user) => {
      if (user === null) {
        res.render("auth/signup");
      } else {
        res.render("confirmation", user);
      }
    }
  );
});

authRoutes.get("/:id", (req, res, next) => {
  let id = req.params.id;
  User.findById(id).then(user => {
    res.render("profile", user);
  });
});
module.exports = authRoutes;