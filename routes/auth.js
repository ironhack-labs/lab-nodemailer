const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const mjml = require('mjml');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const hashUserWithSlash = bcrypt.hashSync(username, salt);
  const hashUser = encodeURIComponent(hashUserWithSlash);

  const templateFile = path.join(__dirname, '../mailing/useThis.mjml')
  const mjmlTemplate = fs.readFileSync(templateFile,'utf8');
  const { html } = mjml(mjmlTemplate, {});
  const templateData = hbs.compile(html);
  const compiledHTML = templateData({username: username, link: `http://localhost:3000/auth/confirm/${hashUser}`});

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashUser
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pepe04444@gmail.com',
      pass: 'm20684-m20684'
    }
  });

  transporter.sendMail({
    to: email,
    subject: 'Minyu Confirmation Email',
    html: compiledHTML
    //`<a href='http://localhost:3000/auth/confirm/${hashUser}'>click link to confirm</a>`
  })
    .then(info => console.log(info))
    .catch(error => console.log(error))
});

authRoutes.get('/confirm/:confirmCode', (req, res, next) => {
  var code = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode: code }, { status: 'Active' }, (err) => {
    if (err) {
      console.log("Something wrong when updating status!");
    } else {
      User.findOne({ confirmationCode: code }, "username")
      .then((result)=>{
        res.render("auth/confirmation",{name: result.username})
      })
      .catch(()=>{
        res.render("auth/confirmation", { message: "confirmation failed"})
      })
    }
  })
})

authRoutes.get('/profile', (req,res) => {
  res.render("auth/profile")
})

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
