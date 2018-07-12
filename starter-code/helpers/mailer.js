const nodemailer = require('nodemailer')
const fs = require('fs');
const hbs = require('hbs')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.gmail,
    pass: process.env.gmailPass 
  }
});
const welcome = hbs.compile(fs.readFileSync((__dirname,'./views/welcome.hbs'), 'utf8'))
exports.sendWelcomeMail = (user)=>{
  const data ={
    from: '"Whazaaa" <ricamposm@gmail.com>',
    to: user.email, 
    subject: 'Probando', 
    text: `Hola ${user.username} bienvenido a nuestro PP Verifica: http://localhost:3000/confirmed/${user.confirmationCode}`,
    // html: welcome(user)
  }
  transporter.sendMail(data)
  .then(info => console.log(info))
  .catch(error => console.log(error))
}