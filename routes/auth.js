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
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let confirmationCode = ''

  for (let i = 0; i < 25; i++) {
    confirmationCode += characters[Math.floor(Math.random() * characters.length)]
  }

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' })
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from: `The team Ironhack <${process.env.EMAIL}>`,
    to: email,
    subject: 'Ironhack Confirmation Email',
    html: `
    
    <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Click here to start to code!</a>`
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
      email,
      password: hashPass
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

router.get('/confirm/:confirmationCode', (req, res) => {
  User.find({ confirmationCode: req.params.confirmationCode }).then(user => {
    let id = user[0]._id

    User.findByIdAndUpdate(id, { status: 'Active' }, function(err, result) {
      if (err) {
        console.log(err)
      }
      let userEmail = user[0].email
      let userId = user[0]._id
      res.render('auth/confirmation', { userEmail, userId })
    })
  })
})

//
router.get('/profile/:id', (req, res) => {
  User.find({ _id: req.params.id })
    .then(user => {
      let username = user[0].username
      let email = user[0].email
      let status = user[0].status
      res.render('auth/profile', { username, email, status })
    })
    .catch(error => {
      console.log('Error occured:', error)
    })
})

// --------------------------------------------
// ------------NODEMAILER CODE ----------------
// --------------------------------------------

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
