const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'periquitojunior65@gmail.com',
    pass: 'periquito_65'
  }
})
module.exports = transporter