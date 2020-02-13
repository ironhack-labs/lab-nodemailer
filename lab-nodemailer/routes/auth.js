const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

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
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 25; i++) {
  token += characters[Math.floor(Math.random() * characters.length)];
}
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmationCode = token;
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
      confirmationCode,
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
     let transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
         user: 'ironhack3000@gmail.com',
         pass: 'Iron3000#'
       }
     });

     transporter.sendMail({
         from: '"Me" <ironhack3000@gmail.com>',
         to: email,
         subject: 'Awesome Subject',
         text: 'Awesome Message',
         html: '<a href=http://localhost:3000/auth/confirm/${confirmationCode}>Enlace</a>'
       })
       .then(info => console.log(info)).catch(error => console.log(error))

  });

});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// router.post('/send-email', (req, res, next) => {
//   let {
//     email,
//     subject,
//     message
//   } = req.body;

 
router.get('/confirm/:confirmCode', (req, res, next) => {
  req.params.confirmationCode === token//??????????
    .then(() => {
    res.render('confirmation.hsb')
  })
.catch(err => {
  res.render("auth/signup", {
    message: "Something went wrong"
  });
})
})
module.exports = router;
