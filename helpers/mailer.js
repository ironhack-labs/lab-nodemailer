const nodemailer = require('nodemailer');
const hbs = require('hbs');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.gmail,
    pass: process.env.gmailPass 
  }
});


exports.sendWelcomeMail= (user)=>{
  transporter.sendMail({
    from: '"Its ya boi 👻" <roloortizgarcia@gmail.com>',
    to: user.email, 
    subject: 'Top Secret', 
    text: `Hola ${user.username}, bienvenido a nuestra Iron App. Confirma tu correo aquí: http://localhost:3000/confirm/${user.confirmationCode}`,
    //html: '<b>Awesome Message</b>'
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}
