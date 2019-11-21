const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: `${process.env.MAIL}`,
    pass: `${process.env.PASS}`
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/profile", (req, res, next) => {
  let user = req.user
  if (user) {
    res.render("auth/profile", {
      user
    });
  } else {
    res.redirect('auth/login')
  }
});


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
    token += characters[Math.floor(Math.random() * characters.length)];
  }


  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", {
      message: "Fields are required"
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

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });


    newUser.save()
      .then(() => {
        res.redirect("/");


        transporter.sendMail({
            from: '"My Awesome Project " <myawesome@project.com>',
            to: newUser.email,
            subject: 'Awesome Subject',
            text: 'Awesome Message',
            html: `<b>Awesome Message</b><br>http://localhost:3000/auth/confirm/${newUser.confirmationCode}`
          })
          .then(info => console.log(info))
          .catch(error => console.log(error))
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});

router.get('/confirm/:confirmationCode', (req, res) => {
  User.findOne(req.params)
    .then(userFound => {
      User.findByIdAndUpdate({
          _id: userFound._id
        }, {
          status: "Active"
        })
        .then(userActivated => {
          res.render('auth/confirmation', {
            userActivated
          })
        })
    })
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;