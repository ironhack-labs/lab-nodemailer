//const express = require('express');
//const router  = express.Router();
//
///* GET home page */
//router.get('/', (req, res, next) => {
//  res.render('index');
//});
//
//module.exports = router;

const router = require('express').Router()

const {
  indexGet,
  signupPost,
  profileGet,
  profilePost,
  confirmGet,
  logout
} = require('../controllers/idexContolles')
router.get('/', indexGet)
router.post('/signup', signupPost)
router.get('/confirm/:confirmationCode', confirmGet)
router.get('/auth/login',profileGet)

router.get('/logout', logout)
module.exports = router