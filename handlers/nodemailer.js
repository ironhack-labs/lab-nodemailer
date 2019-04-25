const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'jgarcia85',
    pass: 'Wiedergeburt1'
  }
})

exports.sendMail = (email) => {
  return transporter
    .sendMail({
      from: '"Tech Company" <info@techcompany.com>',
      to: email,
      subject: 'Hi!, let s make business!',
    })
    .then(response => response)
    .catch(err => err)
}
