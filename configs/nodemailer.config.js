const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({

  service: 'Gmail',
  auth: {
    user: process.env.MAIL_SENDER_USER,
    pass: process.env.MAIL_SENDER_PASS
  }

});