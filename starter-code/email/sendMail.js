const transporter = require("./transporter")

const sendMail = (email, confirmationCode) => transporter.sendMail({
  from: '"Ironhackers nodemailer" <pepe@ironhack.com>',
  to: email,
  subject: "Email de confirmación",
  text: `Hola que tal confirma: http://localhost:3000/auth/confirm/${confirmationCode}`,
  html: `<strong>Hola que talconfirma:</strong> http://localhost:3000/auth/confirm/${confirmationCode}`
}).then(info => {return info.accepted})

module.exports = sendMail