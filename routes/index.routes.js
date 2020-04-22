const express = require('express')
const router = express.Router()
const passport = require('passport')

// detector de sesión & usuario confirmado
const checkStatus = status => (req, res, next) => req.isAuthenticated() && req.user.status.includes(status) ? next() : res.render('auth/unconfirmed', { errorMsg: 'Área restringida. Por favor, confirma tu correo' })

router.get('/', (req, res) => res.render('index'))

router.get('/profile', checkStatus('Active'), (req, res, next) => res.render('profile', req.user))

module.exports = router