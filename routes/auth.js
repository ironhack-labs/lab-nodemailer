const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function createToken() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token
}

router.post('/send-email', (req, res, next) => {
  let {
    email,
    subject,
    message
  } = req.body;
  res.render('auth/message', {
    email,
    subject,
    message
  })
})

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
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
  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const token = createToken();

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: token
    });
    
    let message = `<a href="http://localhost:3000/auth/confirm/${newUser.confirmationCode}">Confirm Here</a>`

    newUser.save()
      .then(() => {        
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'nodemaileriron@gmail.com',
            pass: 'SoniaAlfredo'
          }
        });
        let info = transporter.sendMail({
          from: '"Nodemailer Iron Message " <nodemaileriron@project.com>',
          to: req.body.email,
          subject: "Confirmation email",
          text: "This is the message",
          html: `<b>${message}</b>`
        })
        return info
      })
      .then((info) => {
        console.log({info, message})
        res.render('auth/message', {info, message})
      })
      .catch(err => {
        console.log(err)
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: req.params.confirmCode}, {status: 'Active'})
    .then(() => {
      res.render('auth/confirmation')
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;