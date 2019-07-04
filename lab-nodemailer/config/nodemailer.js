require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SGPASS
  }
})

exports.sendConfirmationCode = (email, confirmationCodeTemplate, username) => {
  return transporter.sendMail({
    to: email,
    from: "'Ironhack' <developer@ironhack.com>",
    subject: `${username}, please confirm your account`,
    html: confirmationCodeTemplate
  })
}