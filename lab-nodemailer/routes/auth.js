const express = require ('express');
const passport = require ('passport');
const router = express.Router ();
const User = require ('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require ('bcrypt');
const bcryptSalt = 10;
const nodemailer = require ('nodemailer');

router.get ('/login', (req, res, next) => {
  res.render ('auth/login', {message: req.flash ('error')});
});

router.post (
  '/login',
  passport.authenticate ('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get ('/signup', (req, res, next) => {
  res.render ('auth/signup');
});

router.post ('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === '' || password === '') {
    res.render ('auth/signup', {message: 'Indicate username and password'});
    return;
  }

  User.findOne ({username}, 'username', (err, user) => {
    if (user !== null) {
      res.render ('auth/signup', {message: 'The username already exists'});
      return;
    }

    const salt = bcrypt.genSaltSync (bcryptSalt);
    const hashPass = bcrypt.hashSync (password, salt);

    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor (Math.random () * characters.length)];
    }

    const newUser = new User ({
      username,
      password: hashPass,
      email: email,
      confirmationCode: token,
    });

    newUser
      .save ()
      .then (() => {
        res.redirect ('/');
        transporter.sendMail ({
          from: '"My email" <myemail@project.com>',
          to: email,
          subject: subject,
          text: message,
          html: `http://localhost:3000/auth/confirm/${confirmationCode}`,
        });
      })
      .catch (err => {
        res.render ('auth/signup', {message: 'Something went wrong'});
      });
      let transporter = nodemailer.createTransport ({
        service: 'Gmail',
        auth: {
          user: 'danielgarciamartinez1985@gmail.com',
          pass: 'exercise-nodemailer',
        },
      });
  });
});

router.get ('/logout', (req, res) => {
  req.logout ();
  res.redirect ('/');
});

router.get ('/send-email', (req, res) => {
  res.render ('write-email');
});

router.post ('/send-email', (req, res, next) => {
  let {email, subject, message} = req.body;


});

module.exports = router;
