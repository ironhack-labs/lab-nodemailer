const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SGPASS
  }
})

exports.sendEmail = (email, confirmationCode) => {
    return transporter.sendMail({
      from: 'Ironhack <ironhack@contact.com>',
      to: email,
      subject: 'Ironhack Confirmation Email',
      html: `<p>Thanks to join our community! 
      Please confirm your account clicking on the following link:</p>
      <br/><br/>
      <a href = "http://localhost:3000/auth/confirm/${confirmationCode}">http://localhost:3000/auth/confirm/${confirmationCode}</a>`
    }) 
}