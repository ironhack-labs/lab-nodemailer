require('dotenv').config();
const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const transporter = require('../mail/transporter');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    message: req.flash('error'),
  });
});

router.post(
  '/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  }),
);

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  const confiramtionCode = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
  };
  const {
    username,
    password,
    email,
  } = req.body;
  const token = confiramtionCode();

  if (username === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate username and password',
    });
    return;
  }

  User.findOne({
    username,
  },
  'username',
  (err, user) => {
    if (user !== null) {
      res.render('auth/signup', {
        message: 'The username already exists',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode:token,
    });

    newUser.save()
      .then(() => {
        // SEND MAIL

        transporter.sendMail({
          from: user,
          to: email,
          subject: 'Awesome Subject',
          text: 'Awesome Message',
          html: `http://localhost:3000/auth/confirm/${token}`,
        })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error));
      })
      .catch(() => {
        res.render('auth/signup', {
          message: 'Something went wrong',
        });
      });
  });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});


router.get('/confirm/:confirmCode', (req, res) => {
  const cCode = req.params.confirmCode;
  User.findOneAndUpdate({ confirmationCode :req.params.confirmCode }, { $set:{ status:'Active' } })
    .then((updated) => {
      res.render('auth/confirmation', { updated });
    })
    .catch((error) => {
      res.render('error');
    });
});


router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


router.get('/profile', (req, res, next) => {
  console.log(req.session.passport);
  User.findById(req.session.passport.user)
    .then((user) => {
      if (user !== null) {
        res.render('auth/profile', { user });
      } else {
        res.redirect('/');
      }
    });
});


module.exports = router;
