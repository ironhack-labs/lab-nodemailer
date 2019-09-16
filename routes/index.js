const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/send-email', async (req, res, next) => {
  const {email, subject, message} = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: `Dan <${process.env.EMAIL}>`,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`
  });

  res.render('message', {email, subject, message, info});
});

module.exports = router;
