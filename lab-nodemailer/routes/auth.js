const express = require('express');
const passport = require('passport');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
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
  const { username, password, email } = req.body;

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
    const tokenFunc = () => {
      const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let token = '';
      for (let i = 0; i < 25; i += 1) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }
      return token;
    };

    const authToken = tokenFunc();

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: authToken,
    });

    newUser.save()
      .then(() => {
        const transporter = nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        transporter.sendMail({
          from: '"Servo-Service 👻" <thatreal@service.com>',
          to: email,
          subject: 'Welcome to Servo-Service! Please confirm your account.',
          text: `
          Hi, there!

          Welcome to Servo-Service, the premier service for services!

          Please, click on the link below to confirm your account:
          http://localhost:3000/auth/confirm/${authToken}`,
          html: `
          <h3>Hi, there!</h3>

          <p>Welcome to Servo-Service, the premier service for services!</p>

          <p>Please, click <a href="http://localhost:3000/auth/confirm/${authToken}">here</a> to confirm your account.</p>`,
        })
          .then((info) => {
            console.log(info);
            res.redirect('/');
          })
          .catch(error => console.log(error));
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/confirm/:confirmCode', (req, res) => {
  const confirmToken = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode: confirmToken }, { status: 'Active' })
    .then((user) => {
      res.render('auth/confirmation', user);
    })
    .catch((err) => {
      res.render('error');
      console.log(err);
    });
});

router.get('/profile', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
