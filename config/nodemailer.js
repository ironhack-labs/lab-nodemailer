require('dotenv').config()

const fs = require('fs')
const hbs= require('hbs')
const nodemailer = require('nodemailer')

const welcomeTemplate = hbs.compile(
  fs.readFileSync((__dirname, './views/email.hbs'), 'utf8')
)

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GOOGLE_USERNAME,
    pass: process.env.GOOGLE_PASSWORD
  }
})

exports.confirmAccount = async (to, endpoint) => {
  return await transporter.sendMail({
    from: "'Luis Lozano' <luis@gmail.com>",
    to,
    subject: 'Confirma tu cuenta',
    html: welcomeTemplate({endpoint})
  })
}
