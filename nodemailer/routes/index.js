const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});

router.get('/profile', (req, res, next) => {
  res.render('profile', {user: req.user});
});

module.exports = router;
