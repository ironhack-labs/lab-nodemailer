const express = require('express');
const passport = require('passport');

const router = express.Router();
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  }),
);

// GET sign up page sending the confirmation code
router.get('/signup', (req, res, next) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  res.render('auth/signup', { token });
});

// POST sign up page that sends email verification and saves user
router.post('/signup', (req, res, next) => {
  const {
    username, password, status, email, confirmationCode,
  } = req.body;
  if (username === '' || password === '') {
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
      password: hashPass,
      status,
      email,
      confirmationCode,
    });

    const message = `http://localhost:3000/auth/confirm/${confirmationCode}`;
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'credentials', // INPUT CREDENTIALS FROM MAILTRAP
        pass: 'credentials', // INPUT CREDENTIALS FROM MAILTRAP
      },
    });
    transport
      .sendMail({
        from: '"My Awesome Project 👻" <myawesome@project.com>',
        to: email,
        subject: 'verification email',
        text: message,
        html: `<a = href='${message}'>Click here to verify your email</a>`,
      })
      .then(info => res.render('auth/send-email', {
        username,
        email,
        subject: 'verification email',
        message,
        info,
      }))
      .catch(error => console.log(error));

    newUser
      .save()
      .then(() => {
        res.render('auth/send-email', {
          username,
          password,
          status,
          email,
          confirmationCode,
        });
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

// GET change status to active from confirmation email
router.get('/confirm/:verifycode', (req, res) => {
  const confirmation = req.params.verifycode;
  User.update({ confirmationCode: confirmation }, { $set: { status: 'Active' } })
    .then(() => {
      User.find({ confirmationCode: confirmation })
        .then((response) => {
          res.render('auth/confirmation', response[0]);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
