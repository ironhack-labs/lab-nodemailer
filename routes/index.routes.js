const express = require('express')
const router = express.Router()
const passport = require("passport")

const ensureLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

router.get('/', (req, res) => res.render('index'))

router.get('/profile', ensureLoggedIn, (req, res) => res.render('profile', req.user))

module.exports = router