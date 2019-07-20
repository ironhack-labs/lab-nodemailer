require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SGPASS
  }
})

exports.sendConfirmation = (email, confirmationCode, username) => {
  return transporter.sendMail({
    from: "'Bryan' <bryan@ironhack.com>",
    to: email,
    subject: 'Please confirm your account',
    html: `
    <h1>${username}</h1>
    <p>Confrim your account son!</p>
    <p>${confirmationCode}</p>
    <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Follow this link to finish confirmation process</a>
    `
  })
}