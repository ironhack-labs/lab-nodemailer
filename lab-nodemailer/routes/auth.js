const express = require('express');
const passport = require('passport');
const router = express.Router();
const nodemailer = require('nodemailer')
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "25f5359b1d30f8",
    pass: "f8c5c3e8d561f2"
  }
});


router.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let confirmationCode = '';
  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length )];
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
      status: 'Pending Confirmation',
      email,
      confirmationCode
    });

    newUser.save()
      .then(() => {
        transport.sendMail({
          from: '"My First E-mail 👻" <37a6f5540d-35e0ea@inbox.mailtrap.io>',
          to: email, 
          subject: 'Registration email', 
          text: `Here is your token! ${confirmationCode}
          Click here: http://localhost:3000/auth/confirm/${confirmationCode}`,
          html: `<html>
          <style>
            @import url('https://fonts.googleapis.com/css?family=DM+Serif+Text&display=swap');
            img {
              width: 250px;
              height: auto;
            }

            div {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            * {
              font-family: 'DM Serif Text', serif;
            }

          </style>
          <div>
          <img src="https://secure.meetupstatic.com/photos/event/d/9/3/e/600_473815614.jpeg" alt="Ironhack">
          <h1>Ironhack confirmation email!</h1>
          <h2>Hello, ${username}!</h2>
          <p>Welcome to our community! Please confirm your account by clicking <a href="http://localhost:3000/auth/confirm/${confirmationCode}">here</a></p>
          <p>Great to have you with us! 😻</p>
          </div>
          </html>`
        })
          .then(info => console.log(info))
          .catch(error => console.log(error))
        res.redirect('/');
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' });
      })
  });
});

router.get('/confirm/:confirmCode', (req, res) => {
  let confirmCode = req.params.confirmCode;
  User.findOneAndUpdate({confirmationCode: confirmCode}, {status: 'Active'})
  .then((user) => {
    res.render('auth/confirmation', user)
  })
  .catch((err) => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
