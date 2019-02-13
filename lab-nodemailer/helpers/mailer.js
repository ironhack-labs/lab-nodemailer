let nodemailer = require('nodemailer')
let hbs = require('handlebars')

let transport = nodemailer.createTransport({
  service: 'Gmail', // otherwise, SMTP details
  auth: {
    user: 'fixtermailer@gmail.com',
    pass: 'polloyon'
  }
})


exports.sendWelcomeMail = function (username, email, confirmationCode) {
  transport.sendMail({
    from: "Pol Ironhack",
    to: email,
    subject: "Bienvenido " + username,
    html: `<h2>Hola ${username}</h2>
    <p>Confirma tu cuenta <a href="http://localhost:3000/auth/confirm/${confirmationCode}">haciendo click aqui</a></p>`
  })
  .then(r=> console.log(r))
  .catch(e=> console.log(e))
}