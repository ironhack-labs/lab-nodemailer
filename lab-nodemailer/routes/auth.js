require('dotenv').config()

const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PWD,
  },
})

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
    passReqToCallback: true,
  })
)

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  const confirmationCode = token

  console.log(confirmationCode)

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }

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
      status: 'Pending Confirmation',
      email,
      confirmationCode,
    })

    newUser
      .save()
      .then(() => {
        res.redirect('/')
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' })
      })
  })
  transporter
    .sendMail({
      from: `'Super App' <process.env.EMAIL>`,
      to: email,
      subject: 'Confirmation Mail',
      html: `<p>Click to Validate your account: <br> <strong><a href='http://localhost:3000/auth/confirm/${confirmationCode}'>Here</a></p></strong>`,
    })
    .then((info) => console.log(info))
    .catch((error) => console.log(error))
})

router.get('/confirm/:confirmationCode', (req, res) => {
  User.findOneAndUpdate(req.params, { status: 'Active' }, { new: true })
    .then((updatedUser) => {
      res.render('auth/confirmation', { updatedUser })
    })
    .catch((err) => console.log('Thre was an error:', err))
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get(
  '/profile',
  passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  }),
  (req, res) => {
    //const requser = req.user
    res.render('auth/profile', req.user)
  }
)

module.exports = router
