require('dotenv').config()
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:process.env.EMAIL,
    pass: process.env.PW
  }
})

exports.sendMail=(email, code)=>{
  transporter.sendMail({
    from: 'Jorge & Saha',
    to:email,
    subject: 'Confirming your email',
    text: 'Bienvenido! Haz click en el link para confirmar tu correo  ',
    html:`<a href="http://localhost:3000/auth/confirm?code=${code}">Verify Your Email NOW </a>`

  })
  .then(info=>console.log(info))
  .catch(e=>console.log(e))
}