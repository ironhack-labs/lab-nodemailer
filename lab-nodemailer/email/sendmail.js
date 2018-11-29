const transporter = require('./transport');


const sendMail = (to, subject, message) => {
    return transporter.sendMail({
      from:'laoferran@gmail.com',
      to, 
      subject, 
      text: subject,
      html: `<a href="localhost:3000/auth/confirm/${message}">confirm your email<a>
      <p>or copy this url in your navigator localhost:3000/auth/confirm/${message}</p> `
    })
    .then(info => console.log(info)).catch(e=>console.log(e))
  }

module.exports = sendMail