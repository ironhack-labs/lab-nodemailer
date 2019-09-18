const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'process.env.EMAIL',
    pass: 'process.env.PASSWORD' 
  }
});