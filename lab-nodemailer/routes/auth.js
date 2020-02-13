const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

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
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const email = req.body.email;
  const confirmCode = token;
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

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmCode
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })

      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "tormentadeldesierto1981@gmail.com",
        pass: "Mangosta2"
      }
    });

    transporter
      .sendMail({
        from: '"Proba proba, los micrófonos "',
        to: email,
        subject: "Ohhhhh",
        text: "${username}",
        html:
          "<a href=http://localhost:9000/auth/confirm/${confirmCode}>Confirma tu email</a>"
      })
      .then(info =>
        res.render("message", { email, username, confirmCode, info })
      )
      .catch(error => console.log(error));
  });
});

router.get("/confirm/:confirmationCode", (req, res) => {
  token = req.params.confirmationCode
  User.findOneAndUpdate({ confirmationCode: { $eq: token } }, { status: 'Active' })
    .then(() => {
      res.render("confirmation", req.user)
    })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
