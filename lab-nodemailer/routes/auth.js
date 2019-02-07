const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;
  if (username === '' || password === '' || email === '') {
    res.render('auth/signup', {
      message: 'Indicate username, password and email'
    });
    return;
  }

  User.findOne({ username, email }, 'username, email', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', {
        message: 'The username or email already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token
    });

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_EMAIL, //Hide information on the .env file
        pass: process.env.GMAIL_PASSWORD //Also password
      }
    });

    transporter.sendMail({
      from: '"My Awesome Project 👻" <myawesome@project.com>',
      to: newUser.email,
      subject: 'Confirm the code',
      text: `http://localhost:3000/auth/confirm/${newUser.confirmationCode}`
    });

    newUser
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/confirm/:confirmCode', (req, res, next) => {
  console.log('DEBUG confirmation code', req.params.confirmCode);

  User.findOne({ confirmationCode: req.params.confirmCode }, (err, user) => {
    console.log('DEBUG USER', user);
  });
  res.render('auth/confirmation');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
