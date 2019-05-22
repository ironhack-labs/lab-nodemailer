const transporter = require("./transporte");

const sendMail = (email, subject, message) => transporter.sendMail({
  from: "pepe.ironhack@gmail.com",
  to: email,
  subject: subject,
  text: message,
  html: `<b>${message}</b>`
})


module.exports = sendMail;