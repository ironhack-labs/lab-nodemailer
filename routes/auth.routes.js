const express = require('express')
const router = express.Router()
const passport = require('passport')
const nodemailer = require('nodemailer')

const User = require('../models/user.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const characters =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
})

// User signup
router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body

  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Rellena el usuario y la contraseña',
    })
    return
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', {
          errorMsg: 'El usuario ya existe en la BBDD',
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      let token = ''
      for (let i = 0; i < process.env.CONFIRMATIONCODELENGTH; i++) {
        token += characters[Math.floor(Math.random() * characters.length)]
      }

      User.create({
        username,
        email,
        password: hashPass,
        confirmationCode: token,
      })
        .then((user) => {
          console.log('EL email de envío es', process.env.EMAIL)
          transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Confirma tu registro a LabExpress ☑️',
            text: `Para poder acceder a LabExpress con tu usuario y contraseña, 
            por favor, confirma tu registro en el siguiente 
            enlace: http://localhost:3000/auth/confirm/${user.confirmationCode}`,
            html: `<p>Para poder acceder a LabExpress con tu usuario y contraseña, 
            por favor, confirma tu registro en 
            <a href="http://localhost:3000/auth/confirm/${user.confirmationCode}">
            el siguiente enlace.</a></p>`,
          })
        })
        .then(() => {
          res.redirect('/')
        })
        .catch(() =>
          res.render('auth/signup', { errorMsg: 'No se pudo crear el usuario' })
        )
    })
    .catch((error) => next(error))
})

// User login
router.get('/login', (req, res) =>
  res.render('auth/login', { errorMsg: req.flash('error') })
)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos',
  })
)

// User logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router
