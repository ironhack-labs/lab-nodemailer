const express = require('express');
const router  = express.Router();
const nodemailer = require("nodemailer")
const template = require("../templates/template")
/* GET home page */
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PW
  }
});

router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;