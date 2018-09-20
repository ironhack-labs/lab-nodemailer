const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const ensureLogin = require("connect-ensure-login")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashUser = bcrypt.hashSync(username, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser,
      status: "Pending Confirmation"
    });

    newUser.save()
      .then((user) => {
        let subject = `Please ${user.username}, confirm your email`
        let message = `<h1>Best Ironhacker's confirmation email</h1>
        <h3>HEEELLOOOO ${user.username}!!</h3>
        <p>Thanks for loggin in. </p>
        <p>Please confirm your account clicking on the following link:</p>
        <hr>
        <br>
        <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">Click here!</a>
        <img src="https://media.giphy.com/media/awRutawdcWLJe/giphy.gif" alt="Epic gif">`
        console.log(user);
        return sendMail(user.email, subject, message)
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      })
  });
});

router.get("/confirm/:hashUser", (req, res, next) => {
  User.findOneAndUpdate({ confirmationCode: req.params.hashUser }, { status: "Active" })
    .then((user) => {
      res.render("auth/confirmation.hbs", { user })
    })
    .catch(err => {
      res.render("auth/login", { message: "Something went wrong" });
    })
})

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/profile", {user: req.user})
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
