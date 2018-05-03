const express = require('express');
const router  = express.Router();


router.get('/profile', (req, res, next) => {
  res.render('profile');
});
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
