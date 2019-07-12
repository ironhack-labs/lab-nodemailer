const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const User = require("../models/User");

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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i += 1) {
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
      password: hashPass,
      confirmationCode: token,
      email,
    });

    newUser.save()
      .then(() => {
        const transport = nodemailer.createTransport({
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: 'e86143af192ef8',
            pass: '5c8ee907365d35',
          },
        });

        transport.sendMail({
          from: '"My Awesome Project 👻" <myawesome@project.com>',
          to: email,
          subject: 'Confirmation',
          text: 'Awesome Message',
          html: `<b><a href="http://localhost:3000/auth/confirm/${token}">Click on this link to confirm</a></b>`,
        })
          .then(info => console.log(info))
          .catch(error => console.log(error))
        res.redirect('/');
      })
      .catch(() => {
        res.render('auth/signup', { message: 'Something went wrong' });
      });
  });
});

router.get('/confirm/:confirm', (req, res) => {
  console.log(req.params.confirm)
  User.findOneAndUpdate({ confirmationCode: req.params.confirm }, { status: 'Active' })
    .then(() => res.render('auth/confirm'))
    .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
