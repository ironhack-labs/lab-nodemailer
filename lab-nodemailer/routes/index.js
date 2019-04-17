const express = require('express');
const router  = express.Router();
const nodemailer = require("nodemailer")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'madwebmar19@gmail.com',
      pass: 'iron2019'
    }
  });
  transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
});


router.get('/send-email', (req, res, next) => {
  res.render('message');
});


module.exports = router;
