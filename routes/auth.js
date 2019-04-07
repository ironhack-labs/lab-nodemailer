const express = require("express");
const passport = require("passport");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const mailer = require("../helpers/mailer");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
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
  //Destructuring of req.body to get all properties but the password
  const { passwordDestr, ...formParams } = req.body;
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
    //creating a code using randomBytes from crypto
    const randomToken = crypto.randomBytes(25).toString("hex");

    const newUser = new User({
      ...formParams,
      confirmationCode: randomToken,
      password: hashPass
    });

    newUser
      .save()
      .then(() => {
        let options = {
          email: formParams.email,
          subject: "Lab Nodemailer - Email verification",
          confirmationUrl: `http://localhost:${
            process.env.PORT
          }/auth/confirm/${randomToken}`
        };
        options.filename = "confirmation";

        console.log(options);

        // en el helper, se vera como exports.send
        mailer
          .send(options)
          .then(() => {
            res.redirect("/");
          })
          .catch(err => {
            console.log(err);
            res.redirect("/");
          });
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

module.exports = router;
