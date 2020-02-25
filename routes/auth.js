const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

const { sendMail } = require("../nodemailer")

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

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and email" });
    return;
  }

  console.log('khee', { username, password, email, token })

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
      confirmationCode: token,
      status: "Pending Confirmation"
    });

    newUser.save()
    .then(() => {
      sendMail({ to: 'coffidev@gmail.com', confirmationCode: token })
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", async (req, res) => {
  const userToVerify = await User.findOne({ confirmationCode: req.params.confirmCode })

  if(userToVerify) {
    let doc = await User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { status: "Active" });
    res.send( userToVerify.username + " confirmed")
  } else {
    res.redirect('/login')
  }
})


module.exports = router;
