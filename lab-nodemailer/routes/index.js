const express = require('express');
const router  = express.Router();
const { isLoggedIn, isActive } = require('../middleware/auth')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/profile', isLoggedIn, isActive, (req, res, next) => {
  const { user } = req
  res.render('auth/profile', user )
})

/*
router.get('/test', (req, res, next) => {
  res.render('template-email' )
})
*/


module.exports = router;
