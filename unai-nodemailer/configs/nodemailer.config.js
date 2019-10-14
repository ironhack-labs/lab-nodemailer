const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'process.env.EMAIL',
    pass: 'process.env.PASSWORD' 
  }
});

module.exports = transporter;