const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/')
  }
}

router.get('/user', ensureAuthenticated, (req, res, next) => {
  res.render('profile', { user: req.user })
});


module.exports = router;
