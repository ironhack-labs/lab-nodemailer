const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET Panel */
router.get('/panel', (req, res, next) => {
  res.render('panel')
})

module.exports = router;
