require('dotenv').config()

const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 15;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: `${process.env.USER_NAME}`,//`nostrahacker@gmail.com`, 
    pass: `${process.env.PASS}` //`perrocagando11`
  }
});


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
    token += characters[Math.floor(Math.random() * characters.length)];
  }


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
      email: email,
      confirmationCode: token,
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
          from: '"NostraRafus 👻" <nostrahacker@gmail.com>',
          to: email,
          subject: 'Awesome nodemailer',
          text: 'Rafa Rules',
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Rafa Rules</title>
          </head>
          <body>
            <h1>Hola Meg</h1>
            <iframe src="https://giphy.com/embed/96ciETgT883Bu" width="480" height="270"  class="giphy-embed" ></iframe><p><a href="https://giphy.com/gifs/family-guy-peter-griffin-96ciETgT883Bu">via GIPHY</a></p>
            <div style="width:100%;height:0;padding-bottom:67%;position:relative;"><iframe src="https://giphy.com/embed/Hv7CK0eIOfc0E" width="100%" height="100%" style="position:absolute"  class="giphy-embed" ></iframe></div><p><a href="https://giphy.com/gifs/family-guy-meg-griffin-Hv7CK0eIOfc0E">via GIPHY</a></p>
            <a href="https:/localhost:3000/auth/confirm/${token}"> Click aqui para confirmar el mail </a>
          </body>
          </html>`
        })
          .then(info => console.log(info))
          .catch(error => console.log(error))

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

router.get("/confirm/:token", (req, res) => {
  
  User.findOneAndUpdate({ confirmationCode: req.params.token }, { $set: { status: "Active" } }, { new: true })
    .then((user) => {
      res.redirect("/auth/login")
      console.log("user activated")
    })
    .catch((err) => {
      console.log(err)
    })
});

module.exports = router;
