const express = require('express');
const router  = express.Router();
const nodemailer = require('nodemailer')


router.post('/send-email', (req, res, next) => {
  let { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "Gmail",
        auth: {
            user: "eagiorganamorales@gmail.com",
            pass: process.env.PASSWORD 
        }  
  })

  console.log(process.env)

  transporter.sendMail({
    from: '"My Awesome Project " <myawesome@project.com>',
    to: email, 
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => res.render('message', {email, subject, message, info}))
  .catch(error => console.log(error));
})

module.exports = router