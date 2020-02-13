const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require('nodemailer')

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
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const confirmationCode = token
  if (username === "" || password === "" || email === '') {
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
      username,
      password: hashPass,
      email,
      confirmationCode
    });



    newUser.save()
      .then(() => {
        res.redirect("/");
      })
      .then(() => {
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'iron123hack@gmail.com',
            pass: 'iron12345'
          }
        });
        transporter.sendMail({
            from: '"My Awesome Project " <myawesome@project.com>',
            to: email,
            subject: 'subject',
            text: 'message',
            html: `<b>http://localhost:3000/auth/confirm/${confirmationCode}</b>`
          })
          .then(info => res.render('message', {
            email,
            subject,
            message,
            info
          }))
          .catch(error => console.log(error));
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Something went wrong"
        });
      })
  });
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  let confirmC = req.params.confirmCode
  User.findOneAndUpdate({
      confirmationCode: confirmC
    }, {status: 'Active'})
    .then(() => {
      res.render('../views/confirmation.hbs')
    })

})



router.post('/send-email', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email

});


module.exports = router;