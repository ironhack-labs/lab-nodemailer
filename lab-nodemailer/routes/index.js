const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/send-email', async (req, res, next) => {
  const { email, subject, message } = req.body;
 const transporter =nodemailer.createTransport ({
  service: 'Gmail',
   auth: {
     user: process.env.EMAIL,
     pass: process.env.PASSWORD
   }
 });
 
 
 const info = await transporter.sendMail({
 from: `Karina <${process.env.EMAIL}>`,
     to: email, 
     subject: subject, 
     text: message,
     html: `<p>${message}`
 })
 console.log(info)
 res.render('message',{email,subject,message,info})
 });





module.exports = router;
