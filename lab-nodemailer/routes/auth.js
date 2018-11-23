const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const authRouter = express.Router();
const transporter = require('../mail/transporter');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/profile/:id",
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
  const status = "Pending Confirmation";
  const confirmationCode = confirmationCodeGenerator();
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
      status,
      confirmationCode,
      email
    });

    newUser
      .save()
      .then(() => {
        transporter.sendMail({
          from: '"Nodemailer Proyect" <ironhackpruebas@gmail.com>',
          to: email,
          subject: 'Awesome Subject',
          text: 'Awesome Message',
          html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">VALIDACION<a>`,
        })
        res.redirect("/")
        .catch(err => console.log(err));
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});



let confirmationCodeGenerator = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
};

router.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmationCode}, {$set: {status: 'Active'}})
  .then(user =>{
    res.render("auth/confirm");
  })
})

router.get("/profile/:id", (req, res, next) => {
  User.findById(req.session.passport.user)
  .then(user =>{
    res.render("auth/profile", {user});
  })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;
