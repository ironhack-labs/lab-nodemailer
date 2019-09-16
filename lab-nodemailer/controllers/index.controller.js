const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

exports.sendEmail = (username, email, confirmationCode) => {
  return transporter
    .sendMail({
      from: '"Ironhack" <hi@ironhack.com>',
      to: email,
      subject: `Nice! You've created an account on Ironhack. 😉`,
      html: styleEmail(username, confirmationCode)
    })
    .then(response => response)
    .catch(err => console.log(err))
}
