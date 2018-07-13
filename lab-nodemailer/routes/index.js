const express = require('express');
const router  = express.Router();
const transporter = require("../mail/transporter");
const nodemailer = require('nodemailer');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/singleUser', (req, res, next) => {
  res.render('singleUser', { user: req.user });
});


router.get('/check', (req, res, next) => {
  res.render('check', { user: req.user });
});

module.exports = router;



