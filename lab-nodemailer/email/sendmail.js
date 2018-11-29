const transporter = require('./transport');


const sendMail = (to, subject, message) => {
    return transporter.sendMail({
      from:'laoferran@gmail.com',
      to, 
      subject, 
      text: subject,
      html: `<a href="/auth/confirm/${message}">confirm your email<a>`
    })
    .then(info => console.log(info)).catch(e=>console.log(e))
  }

module.exports = sendMail