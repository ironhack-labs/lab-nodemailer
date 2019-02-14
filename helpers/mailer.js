let nodemailer = require('nodemailer')
let hbs = require('hbs')
let fs = require('fs')

// let transport = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.gmail,
//     pass: process.env.gmailPass
//   }
// })

let transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.gmail,
    pass: process.env.gmailPass
  }
});
// avflzuebvoyifmgd

// const accountCreated = hbs.compile(fs.readFileSync((__dirname, './views/mail/accountCreated.hbs'), 'utf8'));

exports.sendWelcomeMail = function (name, email, confirmation) {

  return transport.sendMail({
    from: "⚽️",
    bcc: email,
    subject: "Bienvenido " + name,
    text: `Hola ${name}! Bienvenido a nuestra ironApp. Confirma aquí: http://localhost:3000/auth/confirm/${confirmation}`
  })
    .then(resp => resp)
    .catch(e => console.log(e))

}