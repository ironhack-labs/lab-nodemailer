const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'luther002111@gmail.com',
    pass:'barragan02'
  }
})

exports.sendMail=(conf,email)=>{
  transporter.sendMail({
    from:"Luther & Perla",
    to:email,
    subject:"Welcome!",
    text:'aaaa',
    html:`<a href="http://localhost:3000/auth/confirm/?q=${conf}">Confirm your account</a>`
  })
  .then(info=>console.log(info))
  .catch(e=>console.log(e))
}