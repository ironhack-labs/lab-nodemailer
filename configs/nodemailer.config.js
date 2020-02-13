const nodemailer = require('nodemailer')

//Nodemailer Configuration
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ironger3@gmail.com',
    pass: 'germantastico'
  }
})

module.exports = transporter