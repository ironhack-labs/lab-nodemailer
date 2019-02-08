const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD // process.env.GMAIL_EMAIL to hide the GMAIL_PASSWORD in the source code on GitHub 
  }
});

module.exports = transporter