const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ramonaga000@gmail.com',
    pass: 'albricias1234'
  }
});

module.exports = transporter 