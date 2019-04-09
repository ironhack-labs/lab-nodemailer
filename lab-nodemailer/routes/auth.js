const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// email
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// -- LOGIN -- //
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

// -- SIGNUP -- //
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  let confirmationCode = newCode();

  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username, password and e-mail" });
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
      email: email,
      confirmationCode: confirmationCode
    });
    
    newUser.save()
    .then(() => {
      sendConfirmationEmail(email, confirmationCode);
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

// -- CONFIRM -- //
router.get('/confirm/:confirmId', (req, res, next) => {
  const confirmId = req.params.confirmId;
  // lookup user
  User.findOneAndUpdate({confirmationCode: confirmId, status: {$ne: 'Active'}}, {status: 'Active'})
    .then(result => {
      if(!result) {res.render('auth/confirmation', {message: 'User not found or already confirmed'})} 
      res.render('auth/confirmation', {message: 'Confirmation successful'});
    })
    .catch(err => {
      console.log(err);
      res.render('auth/confirmation', {message: 'Something went wrong'})
    })
})

// -- LOGOUT -- //
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function newCode() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZxyz'
  let token = '';
  let i;
  for (i = 0; i < 30; i++) {
    token += characters[Math.floor(Math.random() * (characters.length))]
  }
  return token;
};

function sendConfirmationEmail(email, confirmationCode) {
  // email transporter
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.USERPASS
    }
  });

  // confirmation email
  let mailOptions = {
    from: 'Fedde',
    to: email,
    subject: 'Confirm your e-mailaddress',
    text: `Please confirm your e-mail: http://localhost:3000/auth/confirm/${confirmationCode}`,
    html: `<h2>Welcome to our platform!</h2><br />
          Please <a href="http://localhost:3000/auth/confirm/${confirmationCode}">confirm</a> your e-mail`
  }

  // send email
  transporter.sendMail(mailOptions)
    .then(result => {
      console.log('Email sent', result);
    })
    .catch(err => {
      console.log('Email sending err', err);
    })
}

module.exports = router;
