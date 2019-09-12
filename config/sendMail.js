const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

module.exports = transport;
