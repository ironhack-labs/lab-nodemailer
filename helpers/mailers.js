let nodemailer = require('nodemailer')

let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user:"fixtermailer@gmail.com",
    pass: "polloyon"
  }
})

exports.sendActivationMail = function(name, email, confirmationCode){
  transport.sendMail({
    from:"Fixter",
    bcc:email,
    subject:"Bienvenido " + name,
    html:`
      <h2>Hola ${name}</h2>
      <p>Gracias por crear una cuenta</p>
      <a href="http://localhost:3000/auth/confirm/${confirmationCode}"> Porfavor activa tu correo </a>
    `
  })
  .then(r=>console.log(r))
  .then(e=>console.log(e))``
}