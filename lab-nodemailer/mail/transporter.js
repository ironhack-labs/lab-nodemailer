const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pepe04444@gmail.com',
      pass: 'm20684-m20684' 
    }
  });

module.exports = transporter;