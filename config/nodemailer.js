require('dotenv').config()

const fs = require('fs')
const path = require('path')
const hbs = require('hbs')
const nodemailer = require('nodemailer')

const welcomeTemplate = hbs.compile(
  fs.readFileSync((__dirname, './views/template_email.hbs'), 'utf8')
)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.googleID,
    pass:process.env.googlePASSWORD
  }
})

exports.confirmAccount = async (to, endpoint) => {
  return await transporter.sendMail({
    from: "hola@legoricardo.com",
    to,
    subject: 'Confirm your account',
    html:welcomeTemplate({endpoint})
  })
}
//${endpoint}