const express = require('express');
const router  = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  res.render('message', { email, subject, message })
});


module.exports = router;
