const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

exports.sendMail = (email, confirmationCode)=>{
  transporter.sendMail({
    from: 'IRONHACK WEB DEV',
    to: email,
    subject: 'Eggs!',
    text: ':v',
    html:`<h1>http://localhost:3000/auth/confirm/${confirmationCode}</h1>`
  })
  .then(info => {
    console.log('info')
  })
  .catch(e =>{
    console.log(e)
  })
}

