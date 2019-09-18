const nodemailer = require ("nodemailer")

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pepenodemailer@gmail.com',
    pass: 'Nodemailer.123'
  }
})

module.exports = transporter
