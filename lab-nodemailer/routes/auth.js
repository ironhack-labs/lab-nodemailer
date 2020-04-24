const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const nodemailer = require('nodemailer')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PWD,
  },
})

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

//Signup
router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' })
      return
    }
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let token = ''
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)]
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: token,
    })

    newUser
      .save()
      .then(() => {
        transporter.sendMail({
          from: `Lab nodemailer <${process.env.MAIL}>`,
          to: email,
          subject: 'Lab',
          text: `message`,
          html: `<p>Welcome to Ironhack! Feel free to join our community. Verify your account in 
        http://localhost:3000/auth/confirm/${token}</p>`,
        })
        res.redirect('/')
      })
      .catch((err) => {
        res.render('auth/signup', { message: 'Something went wrong' })
      })
  })
})

//Confirmation route
router.get('/confirm/:confirmationCode', async (req, res) => {
  const confirm = req.params.confirmationCode
  const userId = await User.findOne({ confirmationCode: confirm })
  if (confirm === userId.confirmationCode) {
    User.findOneAndUpdate(confirm, { status: 'Active' }, { new: true })
      .then((user) => {
        console.log(user)
      })
      .catch((err) => err)
    res.render('auth/confirm')
  } else {
    res.render('error')
  }
})

// router.post('/auth/confirm/7ubwY7so3vciTRyoHPBnCGUw2', (req, res) => {
//   const confirm = req.params.confirmationCode
//   console.log(confirm)
//   res.render('/', confirm)
// })

//Profile Route
router.get('/profile/:id', async (req, res) => {
  const userProfile = req.params.id
  const userId = await User.findById(userProfile)
  res.render('auth/profile', userId)
})

//Logout Route
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
