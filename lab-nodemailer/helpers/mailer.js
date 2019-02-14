require('dotenv').config();

let nodemailer = require('nodemailer')
let hbs = require('hbs')

let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "EMAIL",
    pass: "PASSWORD"
  }
})

exports.sendWelcomeMail = function(name, email){

  transport.sendMail({
    from: "🤨",
    bcc: email,
    subject: "Bienvenido " + name,
    //html: accountCreated({name}),
    html: `
      <h2>Hola ${name}</h2>
      <p>Bienvenido a esta pagina</p>
      <p>Confirma tu cuenta <a href="http://localhost:3000/auth/confirm/">haciendo click aqui</a></p>
    `
  })
  .then(r=>console.log(r))
  .catch(e=>console.log(e))

}