require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'laoferran@gmail.com',
      pass: process.env.MAILPASS
    }
});

module.exports=transporter