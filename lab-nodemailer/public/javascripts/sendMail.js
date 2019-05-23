const transporter = require("./transporte");

const sendMail = (email, subject, message) => transporter.sendMail({
  from: '"My Awesome Project 👻" <myawesome@project.com>',
  to: email, 
  subject: subject, 
  text: message,
  html: `Confirmation code <b>${message}</b>, <a href="http://localhost:3000/auth/confirm/${message}">click aqui</a>`
}).then(info => {return info.accepted})


module.exports = sendMail;