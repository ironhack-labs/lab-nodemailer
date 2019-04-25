const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/confirmation', (req, res, next) => {
  res.render('confirmation');
});

router.get('/profile', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  res.render('profile', req.user);
});

module.exports = router;
