const nodemailer = require ('nodemailer')

const transporter =nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user:"mishelgoga91@gmail.com",
    pass:"kikilover91"

  }
})


exports.sendMail=(email, code, newUser)=>{
  transporter.sendMail({
    from:"Ironhackers",
    to: email,
    subject: "Confirmation Email",
    text: "hola",
    html:`<h1>hola ${newUser}</h1><a href="http://localhost:3000/auth/confirm/${code}">Confirm your account</a>`
  })
  .then(info=>console.log(info))
  .catch(e=>console.log(e))
}