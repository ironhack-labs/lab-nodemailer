const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({

service: 'Gmail',
auth: {
  user: 'omar.avelar.f@gmail.com',
  pass: 'addodd902347abd.'
},
})

function welcomeMail(name, email, token){
  transport.sendMail({
    bcc: email,
    subject: "Confirma tu usuario",
    from: 'rickymartin@gmail.com',
    html: `
    <h1> Bienvenido ${name}</h1>
    <p>da click en la siguiente liga para confirmar tu correo: </p>
    <a href="http://localhost:3000/auth/confirm/${token}">Click</a>
    `
  }).then(res=>{
    console.log(res)
  })
}

module.exports = {welcomeMail}