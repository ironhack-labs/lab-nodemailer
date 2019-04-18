const express = require('express');
const router  = express.Router();
const nodemailer = require("nodemailer")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/send-email', (req, res, next) => {
  res.render('message');
});


module.exports = router;
