const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ajpalacios.sist@gmail.com',
    pass: 'Cpowercru11'
  }
})

exports.sendMail = (email, confirmationCode)=>{
  transporter.sendMail({
    from: 'Jordy69',
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

