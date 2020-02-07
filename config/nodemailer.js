require('dotenv').config()

const fs = require('fs')
const path = require('path')
const hbs = require('hbs')
const nodemailer = require('nodemailer')

//const welcomeTemplate = hbs.compile(
//  fs.readFileSync((__dirname, '.'), 'utf8')
//)

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
})

exports.confirmAccount = async (to) => {
  return await transporter.sendMail({
    from: "'Ironhack' <ironhack@prueba.com>",
    to,
    subject: 'Confirm your account',
    text: 'confimar email'
  })
}