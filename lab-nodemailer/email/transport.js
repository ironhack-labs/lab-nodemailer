const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'ProtonMail',
  auth: {
    user: process.env.ProtonMail_USER,
    pass: process.env.ProtonMail_PASSWD 
  }
});;

module.exports = transporter;