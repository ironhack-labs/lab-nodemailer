const express = require('express');
const router  = express.Router();

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
  to: 'receiver@myawesomereceiver.com', 
  subject: 'Awesome Subject',
  text: 'Awesome Message',
  html: '<b>Awesome Message</b>'
})
.then
.then(info => res.json({email, subject, message, info}))
// (info => console.log(info))
.catch(error => console.log(error))
})

module.exports = router;