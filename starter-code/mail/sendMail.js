const transporter = require("./transporter");
const path = require("path");

const sendMail = (to, confirmationCode, from ="pepe.ironhack@gmail.com") => {
  return transporter
    .sendMail({
      from: `[mad pp fer] <${from}>`,
      to,
      subject: `[mad pp fer]`,
      html: `<p>hola</p> <a href="http://localhost:3000/auth/confirm/${confirmationCode}">Confirm your email</a>`
    })
    .then( info => consolo.log(info))
}

module.exports = sendMail;