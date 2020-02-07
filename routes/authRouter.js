const router = require('express').Router()
const { isLogIn } = require('../middleware/auth')

const {
  signupView,
  signupPost,
  loginView,
  loginPost,
  confirmView,
  profileView,
  logout
} = require('../controllers/auth.controllers')

router.get('/signup', signupView)
router.post('/signup', signupPost)

router.get('/login', loginView)
router.post('/login', loginPost)

router.get('/confirm/:token', confirmView)
router.get('/profile', isLogIn, profileView)

router.get('/logout', logout)

module.exports = router