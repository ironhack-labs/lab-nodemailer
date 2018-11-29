const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'migue.8791@gmail.com',
    pass: 'MiguEmma8'
  }
})

function welcomeMail(name, email, token){
  transport.sendMail({
    bcc: email,
    subject: `Bienvenido`,
    from: "migue.8791@gmail.com",
    html:`
    <h1>Bienvenido a ${name}</h1>
    <p> Gracias por registrarte!</p>
    a href='http://localhost:3000/auth/confirm/${token}'>Click aqui para confirmar tu correo</a>`
  })
}


module.exports = { welcomeMail }
