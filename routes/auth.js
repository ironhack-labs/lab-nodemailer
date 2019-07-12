const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');

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
  const status = false;
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
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
      email,
      status,
      confirmationCode: token
    });
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
      }
    });

    newUser.save()
    .then(() => {
      transport.sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email, 
        subject: 'Confirme sua conta',
        text: `Acesse o link http://localhost:3000/auth/confirmation/${newUser.confirmationCode} para confirmar sua conta!`,
        html: `Acesse o link <b>http://localhost:3000/auth/confirmation/${newUser.confirmationCode}</b> para confirmar sua conta!`
      })
      .then(() => res.redirect("/"))
      .catch(error => console.log(error));
    })
    .catch(err => {
      console.log(err)
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirmation/:code", (req, res) => {
  const {code} = req.params;
  User.find({confirmationCode:{$eq: code}})
  .then(result => {
    User.update({_id: result[0]._id}, {status: true})
    .then(() => {
      res.render('confirmation', result[0]);
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
});

module.exports = router;
