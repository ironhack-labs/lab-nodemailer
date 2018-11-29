const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
service: 'Gmail',
auth:{
  user: 'testerironhack2018@gmail.com',
  pass: 'testerironhack'
}
})

function welcomeMail(name,email,token){
  transport.sendMail({
    to:email,
    subject: 'Confirma tu usuario',
    from: "azul@azul.com",
    html:`
    <h1>Hola Bienvenido ${name}</h1>
    <p>Sigue esta liga para confirmar tu usuario:  </p>
    <a href="http://localhost:3001/auth/confirm/${token}">Click aqui</a>
    `
  })
  .then(res =>{
    console.log(res)
  })
  .catch(err=>{
    console.log(err);
    
  })
}


module.exports = {welcomeMail}