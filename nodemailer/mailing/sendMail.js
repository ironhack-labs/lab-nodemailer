const transporter = require('./transporter');

const sendMail = (email, confirmation) => {
  return transporter.sendMail({
    from: `"Ironhacker X" <${process.env.EMAIL}>`,
    to: email, 
    subject: 'Confirmate your account', 
    html: `<b>http://localhost:3000/auth/confirm/${confirmation}</b>`
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}

module.exports = sendMail;