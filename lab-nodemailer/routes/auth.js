const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const transporter = require('../mail/transporter');

const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
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
  const { username, email, password } = req.body;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

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
      email,
      password: hashPass,
      confirmationCode: token,
    });

    newUser.save()
      .then(() => {
        transporter.sendMail({
          from: 'My email',
          to: `${newUser.email}`,
          subject: 'itsame',
          text: 'pepe',
          html: `<a>http://localhost:3000/auth/confirm/${newUser.confirmationCode}</a>`,
        });
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
  User.findByIdAndUpdate(req.user.id, { status: 'Active' })
    .then(() => res.redirect('/'))
    .catch(err => next(err));
});

module.exports = router;
