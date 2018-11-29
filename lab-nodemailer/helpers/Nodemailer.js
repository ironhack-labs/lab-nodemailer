const nodemailer = require("nodemailer")

const trasport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "montseortiz29@gmail.com",
    pass: "5529035980montse"
  }
})

function welcomeMail (name, email, token){
  trasport.sendMail({
    bcc: email,
    subject: "Hola, confirma tu usuario",
    from: "hola@hola.com",
    html: 
    `
    <h1>Bienvenido  ${name} </h1>
    <p>Paraconfirmar tu correo, da click en la siguiente linea</p>
    <a href="http://localhost:3000/auth/confirm/${token}">Da click</a>
    `
  })
}


module.exports = {welcomeMail}
