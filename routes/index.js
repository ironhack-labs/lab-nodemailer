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

router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    info: JSON.stringify(info,null,2),
    html: templates.templateExample(message),
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});

module.exports = router;