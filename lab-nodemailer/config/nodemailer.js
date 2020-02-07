require('dotenv').config()

const fs = require('fs')
const path = require('path')
const hbs = require('hbs')
const nodemailer = require('nodemailer')

const welcomeTemplate = hbs.compile(
  fs.readFileSync((__dirname, './views/template.hbs'), 'utf8')
)

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
})

exports.confirmAccount = async (to, endpoint) => {
  console.log('En mi config prro', endpoint)
  return await transporter.sendMail({
    from: "'Vic & Charlie' <vic.car@mail.com>",
    to,
    subject: 'Confirm your account',
    html: welcomeTemplate({ endpoint })
  })
}