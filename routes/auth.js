const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


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
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  if (username === "" || password === "" || email === "") {
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

    const newUser = new User({
      username: username,
      password: hashPass,
      status: "Pending Confirmation",
      confirmationCode: token,
      email: email
    });
    console.log(newUser)


    newUser.save()
      .then((newUser) => {
        let {
          username,
          email,
          confirmationCode,
        } = newUser;
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'pruebadeiron@gmail.com',
            pass: 'ironhack'
          }
        });
        transporter.sendMail({
            from: '"My Awesome Project " <pruebadeiron@gmail.com>',
            to: email,
            subject: 'Codigo de confirmación',
            text: `Hola ${username} te enviamos tu código de confirmación`,
            html: `<b>Hola!! Tu código de confirmación es${confirmationCode}</b>`
          }).then(res.redirect('/'))
          .catch(error => console.log(error));
      })
      .catch(err => {
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

module.exports = router;