/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();
// Bcrypt to encrypt passwords
const bcryptSalt = 10;

function codeGenerator() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}
router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

function sendConfirmationMail(userMail, confirmationCode) {
  transporter.sendMail({
    from: `"My Awesome Project " ${process.env.SERVEREMAIL}`,
    to: `${userMail}`,
    subject: 'Confirmation Code',
    text: 'Confirm Email',
    html: `<a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirm E-mail</a>`,
  })
    .then(info => console.log(info))
    .catch(error => console.log(error));
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: `${process.env.SERVEREMAIL}`,
    pass: `${process.env.SERVEREMAILPW}`,
  },
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmationCode = codeGenerator();

  if (username === '' || email === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode,
    });

    newUser.save()
      .then(() => {
        sendConfirmationMail(email, confirmationCode);
        res.redirect('/');
      })
      .catch(() => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/confirm/:confirmationCode', (req, res, next) => {
  User.findOneAndUpdate({ confirmationCode : req.params.confirmationCode }, { $set: { status: 'active' } })
    .then((user) => {
      console.log('success');
      res.render('auth/confirmation', { user });
    })
    .catch(err => next(err));
});

// router.post('/confirm/:id', (req, res, next) => {
//   User.findOne(req.params.id)
//     .then((found) => {
//       found.status = 'active';
//       found.save()
//         .then(() => redirect('/'))
//         .catch(error => console.log(error));
//     })
//     .catch(err => next(err));
// });

module.exports = router;
