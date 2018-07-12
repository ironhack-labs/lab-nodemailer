const env = require("dotenv");
env.config();
env.config({path: './env.private'});

const {transporter} = require("../mailing/transport.js");

let mySendMailFunction = (to, message) => {
  return transporter.sendMail({
    from: 'La web donde te has registrado',
    to: to, 
    subject: 'Tienes un email', 
    text: message,
    html: `<b>${message}</b>`
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
} 

module.exports = mySendMailFunction;