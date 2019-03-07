const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


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
  let confirmationCode = token;


  if (username === "" || password === "") {
    res.render("auth/signup", {
      message: "Indicate username and password"
    });

    return;
  }

  User.findOne({ username }, "username", (err, user) => {
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
      email: email,
      confirmationCode: confirmationCode
    });

    newUser.save()
      .then(() => {
        message: "User saved!"
        res.redirect("/auth/signup");
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zzzzzzzzzzzzzzzzzz',
      pass: 'xxxxxxxxxxxxxx'
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email,
    subject: "Este es el email enviado",
    html: `<h2> Bienvenido a Ironbeers!</h2><br><p>Por favor, confirma tu email haciendo click en le siguiente enlace</p><br><a href="http://localhost:3000/auth/confirm/${confirmationCode}">Link</a>`
  })


});
/////////////////////////////////////////////////////////////////

router.get("/confirm/:token", (req, res, next) => {
      const tokenConfirm = req.params.token;
      console.log(tokenConfirm)

      User.findOneAndUpdate({ confirmationCode:tokenConfirm },{status:"Active"}, {new:true})
      .then(user => {
        console.log(user)
        res.render("auth/confirmation");
      })
    })
    /////////////////////////////////////////////////////////////////////////

    router.get("/profile",ensureAuthenticated, (req, res, next) => {
      const user = req.user;
      res.render("auth/profile",{user})
    })

      router.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
      });



      module.exports = router;
