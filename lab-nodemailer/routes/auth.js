const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const ensureLogin = require("connect-ensure-login");

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

    const confirmationCode = token;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADDRESS,
        pass: process.env.PASSWORD
      }
    });

    const templateFile = path.join(__dirname, "./templates/template.html");
    const htmlstr = fs.readFileSync(templateFile).toString();
    var template = hbs.compile(htmlstr);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    newUser
      .save()
      .then(
        transporter.sendMail({
          from: '"Full Stack Dev Student 👻" <olabarridev@gmail.com>',
          to: email,
          subject: "Welcome to Ironhack",
          text: template,
          html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">CONFIRMATION CODE<a>`
        })
      )
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  const { confirmationCode } = req.query;
  User.findOneAndUpdate(
    { confirmationCode: confirmationCode },
    { $set: { status: "Active" } },
    { new: true },
    (err, user) => {
      res.render("confirmation", user);
    }
  );
});

router.get("/private/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("profile", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
