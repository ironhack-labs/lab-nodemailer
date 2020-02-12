
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'saraironhack@gmail.com',
    pass: 'sarairon'
  }
})

module.exports = transporter