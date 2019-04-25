const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.NMUSER,
    pass: process.env.NMPASS
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

function styleEmail(username, confirmationCode) {
  return `
  <html>
  <body style="text-align:center; width: 1000px;">
  <img src="https://course_report_production.s3.amazonaws.com/rich/rich_files/rich_files/4017/s300/logo-ironhack-blue.png" alt="Ironhack" width="200"/>
  <h1>Ironhack Confirmation Email</h1>
  <h2>Hello, ${username}.</h2>
  <p>Thanks to join our community! Please confirm your account clocking on the following link:</p>
  <p><a href="http://localhost:3000/auth/confirm/${confirmationCode}">http://localhost:3000/auth/confirm/${confirmationCode}</a></p>
  <p>Freat to seee you creating awesome webpages you with us! 😎</p>
  </body>
  </html>
  ` 
}
