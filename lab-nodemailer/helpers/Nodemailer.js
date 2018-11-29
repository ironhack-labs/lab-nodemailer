const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'mefitdev@gmail.com',
    pass: '30Seconds'
  },
})

function welcomeMail(name, email, token){
  transport.sendMail({
    bcc: email,
    subject: 'Confirma tu usuario.',
    from: 'rickymartin@gmail.com',
    html: `
    <h1>Bienvenido ${name}</h1>
    <p>Da click en la siguiente liga para confirmar tu correo: </p>
    <a href="http://localhost:3000/auth/confirm/${token}">Click aqui</a>
    `
  })
}

module.exports = { welcomeMail }