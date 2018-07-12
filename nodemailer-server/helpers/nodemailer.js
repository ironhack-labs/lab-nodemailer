const nodemailer = require('nodemailer');
const hbs = require('hbs');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: process.env.MAILSERVER,
  port: process.env.MAILPORT,
  secure: true, // use SSL
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS
  }
});

exports.sendWelcomeMail = (user)=>{
  const data = {
    from: '"Iron App 👻" <bitacora@rgasesores.com.mx>',
    to: user.username, 
    subject: 'Probando nodemailer', 
    text: `Hola ${user.username}, bienvenido a nuestra Iron App. Confirma tu correo aquí: http://localhost:3000/confirm/${user.confirmationCode}`,
    //html: '<b>Awesome Message</b>'
  }
  transporter.sendMail(data)
    .then(info => console.log(info))
    .catch(error => console.log(error))
}