const nodemailer = require('nodemailer');
require('dotenv').config();



const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

transporter.sendConfirmationMail = (receiver, text) => {
  this.sendMail({
    from: process.env.GMAIL_USER,
    to: receiver,
    subject: "Please confirm your account",
    text : text
  })
}

module.exports = transporter;
