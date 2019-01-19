const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// function to generate random confirmationCode
function genConfirmCode(){
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length )];
}
return token;
}

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
  const confirmationCode = genConfirmCode();
  if(username === "" || password === "") {
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
      confirmationCode,
      email
    });

    newUser.save()
    .then(() => {
      //
      // user is now persisted into DB, let's send him a confirmation email
      //
      let { email, subject, message } = req.body;
      let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.user,
          pass: process.env.pass 
        }
      });
      transporter.sendMail({
        from: '"Justar 👻" <justar2019@outlook.fr>',
        to: email, 
        // subject: subject, 
        //text: message,
        html: `<b>coucou</b>`
      })
      .then(message=> {
        res.send('ok email')
        //res.render('auth/message', {email})
      })
      .catch(error => {
        console.log(error);
        res.send('Nok email')
      });
    })
    .catch(err => {
      res.send('nok save')
      //res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.post('/message', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'justar2019',
      pass: 'ironhack75' 
    }
  });
    transporter.sendMail({
      from: '"Justar 👻" <justar2019@outlook.fr>',
      to: email, 
      // subject: subject, 
      //text: message,
      html: `<b>${message}</b>`
    })
    .then(message=> res.render('auth/message', {email, subject, message}))
    .catch(error => console.log(error));
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
