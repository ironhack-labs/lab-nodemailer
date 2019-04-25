const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.NMUSER,
    pass: process.env.NMPASS
  }
})

exports.sendConfirmationCode = (email) => {
  transporter.sendMail({
    from: 'ironhack@gmail.com',
    to: email,
    subject: 'Confirmation Code',
    html: 'http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER' 
  }).then(response => console.log(response))
  .catch(err => console.log(err))
}
