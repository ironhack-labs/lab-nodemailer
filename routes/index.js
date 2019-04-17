const express = require('express');
const router  = express.Router();
const User = require('../models/User');


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); 
  }

  // denied. redirect to login
  res.redirect('/')
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/profile', ensureAuthenticated, (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      res.render('profile', {user});
    })
    .catch(err => console.error(err));
});

module.exports = router;
