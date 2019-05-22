const transporter = require("./transporte");

const sendMail = (email, subject, message) => transporter.sendMail({
  from: '"My Awesome Project 👻" <myawesome@project.com>',
  to: email,
  subject: subject,
  text: message,
  html: `<b>${message}</b>`
}).then(info => { return info.accepted })


module.exports = sendMail;