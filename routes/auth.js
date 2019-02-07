const express = require("express");
const passport = require("passport");
const transporter = require("../configs/transporter");
const { emailTemplate } = require("../configs/emailTemplate");
const User = require("../models/User");
const router = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// CREATE UNIQUE CONFIRMATION CODE
function createConfirmationCode() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

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
  const { username, email, password } = req.body;
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
    let confirmationCode = createConfirmationCode();

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    });

    Promise.all([
      newUser.save(),
      transporter.sendMail({
        from: '"Nodemailer Projext 👻" <nodemailer@project.com>',
        to: email,
        subject: "Please confirm your email adress",
        text: `Please click this link http://localhost:3000/auth/confirm/${confirmationCode} to confirm your email adress!`,
        html: emailTemplate(username, confirmationCode)
      })
    ])
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  try {
    User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { status: "Active" }).then(
      () => {
        res.redirect("/");
      }
    );
  } catch {
    console.log("Uups");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
