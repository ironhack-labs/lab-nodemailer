const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tucusitasi@gmail.com',
    pass: 'germantastico'
  }
})

module.exports = transporter