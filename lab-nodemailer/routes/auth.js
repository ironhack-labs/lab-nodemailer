require('dotenv').config()
const nodemailer = require('nodemailer');
const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.get("/profile/:user", (req, res, next) => {
  userId = req.params.user
  User.findOne({ _id: userId })
    .then((user) => {
      res.render('auth/profile', user)
    })
    .catch((error) => {
      console.log('Not authenticated!'), error
    })
});


router.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
}),
(req, res, next) => {
  const username = req.body.username

  User.findOne({ username })
    .then((user) => {
      res.redirect(`profile/${user._id}`)
    })
    .catch((error) => {
      console.log('Not authenticated!'), error
    })

})
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
})

router.post("/signup", (req, res, next) => {
  const fromMail = process.env.EMAIL
  const fromPass = process.env.PASSWORD
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const code = () => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length )];
      }
      return token
    }

    const confirmation = code()

    const newUser = new User({
      username,
      password: hashPass,
      confirmationCode: confirmation,
      email
    });

    newUser.save()
    .then(() => {
      console.log('Successfully added to the database')
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: fromMail,
        pass: fromPass
      }
    });
    transporter.sendMail({
      from: '"Ironhack Team " <mateomadariaga96@gmail.com>',
      to: email, 
      subject: 'Confirmation Email', 
      text: 'Confirmation link for user account',
      html: `<p>http://localhost:3000/auth/confirm/${confirmation}</p>`
    })
    .then(() => console.log('Email sent'))
    .catch(error => console.log(error));

  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  let code = req.params.confirmCode
  User.findOneAndUpdate({confirmationCode: code}, {status: 'Active'})
    .then(() => {
      console.log('User status updated')
      res.render('auth/confirmation')
      }
    )
    .catch((error) => {
      console.log('You are not active in the application', error)
      res.render('error')
    })
})

module.exports = router;
