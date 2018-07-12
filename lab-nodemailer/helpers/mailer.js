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


// const welcomeCompile = hbs.compile(fs.readFileSync((__dirname, './views/welcome.hbs'), 'utf8'));

exports.sendTemplate = (user) => {
    const data = {
        from: 'Kiubo? 👻 <beth.shook@gmail.com>',
        to: user.email, 
        subject: 'Bienvenido', 
        text: `Hola ${user.username}! Bienvenido a nuestra ironApp. Confirma aquí: http://localhost:3000/auth/confirm/${user.confirmationCode}`
      }
    transporter.sendMail(data)
      .then(info => console.log(info))
      .catch(error => console.log(error))
} ;