const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  // Token
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  const confirmationCode = token

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }

  /*****************************+*/
  /********** NODEMAILER ******+*/
  /****************************+*/
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })
  const info = await transporter.sendMail({
    from: '"Ivan " <${process.env.EMAIL}>',
    to: email,
    subject: 'Your friends at localhost',
    html: `<b>Your confirmation code: http://localhost:3000/auth/confirm/${confirmationCode}</b>`
  })

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' })
      return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode
    })

    newUser
      .save()
      .then(() => {
        res.redirect('/')
      })
      .catch(err => {
        res.render('auth/signup', { message: 'Something went wrong' })
      })
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

/*************************************/
/*********** CONFIRMATION ***********/
/************************************/
router.get('/confirm/:confirmCode', async (req, res) => {
  const user = await User.find({ confirmationCode: req.params.confirmCode })

  if (user.length >= 1) {
    res.render('auth/confirmation')
  } else {
    res.render('auth/fake.hbs')
  }
})

module.exports = router
