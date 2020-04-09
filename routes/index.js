const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



// GET private
router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
