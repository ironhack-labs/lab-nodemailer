const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

exports.sendConfCode = (email,confCode) => {
  transporter.sendMail({
    from: '"Agemeddi" <sign@agemeddi.com>',
    to: email,
    subject: "Welcome to Agemeddi! Confirm Your Email",
    html:`
    <h3>You're on your way! 😆</h3>
    <p>Let's confirm your email address.</p>
    <p>By clicking on the following link, you are confirming your email address.</p>
    <p><a href="http://localhost:3000/auth/confirm/${confCode}">Confirm mail</a></p>
    `
  }).then((response) => {
    console.log(response);
  })
  .catch( err => console.log(err))
}