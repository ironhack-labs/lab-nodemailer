const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: 'santiagomb@gmail.com',
    pass: 'password',
  }
})
 function welcomeMail(name, email, token){
   transport.sendMail({
    bcc: email,
    subject: 'Bienvenido',
    from: 'santiagomb@gmail.com',
    html:`
    <h1>Bienvenido a ${name}</h1>
    <p> Gracias por registrarte!</p>
    <p> confirma tu correr</p>
    <a href='http://localhost:3000/auth/confirm/${token}'>Click aqui</a>
    `
   })
 }



module.exports = {welcomeMail}