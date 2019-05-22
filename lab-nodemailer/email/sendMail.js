const transporter = require("./transport")

const sendMail = (email, subject, message) => transporter.sendMail({
  from: '"Marvellous Pepe" <pepe.ironhack@gmail.com>',
  to: email,
  subject: subject,
  text: message,
  html: `<b>${message}</b>`
})

module.exports = sendMail