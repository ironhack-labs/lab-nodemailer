const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const { send } = require("../helpers/mailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
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

    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token,
      status: "Pending Confirmation"
    });

    newUser
      .save()
      .then(() => {
        const options = {
          filename: "register",
          email: newUser.email,
          message: "Validate your email account",
          subject: "Email confirmation",
          confirmationCode: newUser.confirmationCode
        };
        send(options);

        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res) => {
  let { confirmCode } = req.params;
  console.log(confirmCode);
  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { status: "Active" },
    (err, user) => {
      console.log(user);
      console.log("completed!!!!!");
      res.render("auth/confirmation", { err });
    }
  );
});

module.exports = router;
