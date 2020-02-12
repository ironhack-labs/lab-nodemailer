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
    successRedirect: "/user",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);



router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/profile/:username", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  getToken = () => {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
  };
  let token = getToken();
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
      confirmationCode: token
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "alejandroszspam@gmail.com",
      pass: "1r0nh4ck"
    }
  });

  transporter
    .sendMail({
      from: "<alejandroszspam@gmail.com>",
      to: `<${email}>`,
      subject: "Awesome Subject",
      text:
        // "hola"
        `Awesome Message http://localhost:3000/auth/confirm/${token}`
      //   html: `<b>Awesome Message</b>   http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER
      // `
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
});
// router.post("/send-email", (req, res, next) => {
//   let { email, subject, message } = req.body;
//   res.render("message", { email, subject, message });
// });
router.get("/confirm/:confirmationCode", (req, res) => {
  let { confirmationCode } = req.params;
  const filter = { confirmationCode };
  const update = { status: "Active" };
  User.findOneAndUpdate(filter, update, {
    // new: true,
    // upsert: true // Make this update into an upsert
  })
    .then(user => {
      console.log(user);
      return res.render("auth/confirmation", { user });
    })
    .catch(error => res.render("auth/confirmation", error));
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
