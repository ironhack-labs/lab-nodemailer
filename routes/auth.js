const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const transporter = require('../config/nodemailer');
require('dotenv').config();

// Middlewares
const confirmationCodeGen = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};
function ensureLogin(req, res, next) {
  return req.isAuthenticated() ? next() : res.redirect('/login');
}

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/confirm/:confirmationCode', async (req, res, next) => {
  const { confirmationCode } = req.params;
  const user = await User.findOne({ confirmationCode });
  if (user) {
    user.status = user.confirmationCode === confirmationCode ? 'Active' : 'Pending Confirmation';
    await User.findByIdAndUpdate( user._id, {status:user.status} );
    res.render('auth/confirmation')
  } else return res.render('not-found');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;

  if (username === '' || password === '')
    return res.render('auth/signup', { message: 'Indicate username and password' });
  User.findOne({ $or: [{ username }, { email }] }, 'username', (err, user) => {
    if (user !== null)
      return res.render('auth/signup', { message: 'The username or email already exists' });

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashPass,
      confirmationCode: confirmationCodeGen(),
    });

    newUser
      .save()
      .then(usr => {
        transporter
          .sendMail({
            from: `"My Awesome Project " <${process.env.EMAIL}>`,
            to: usr.email,
            subject: 'Please verify your email address',
            text: `
          You have registered in our app click the link below to gain access
          
          url: http://localhost:3000/auth/confirm/${usr.confirmationCode}
          `,
            html: `<b> You have registered in out app click the link below to gain access<br>url: http://localhost:3000/auth/confirm/${usr.confirmationCode} </b>`,
          })
          .then(info => res.render('auth/message', usr))
          .catch(error => console.log(error));
      })
      .catch(err => res.render('auth/signup', { message: 'Something went wrong, try again' }));
  });
});


router.get('/profile',ensureLogin, async (req, res, next) => {
  const {user} = req.session.passport
   const usr = await User.findById(user)
  console.log(usr)
  res.render('auth/profile', usr);
});

router.get('/logout',ensureLogin, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
