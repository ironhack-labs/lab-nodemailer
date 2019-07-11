const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');

const router = express.Router();

const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
  const { user } = req;
  res.render('profile', { user });
});

module.exports = router;
