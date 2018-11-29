const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'', 
  }
})

function welcomeMail(name, email, token){
  transport.sendMail({
    bcc: email,
    subject: 'Confirmation',
    from: 'chrisLoco@gmail.com',
    html: `
      <h1>Welcome, ${name}</h1>
      <p>click the next link to confirm the email</p>
      <a href="http://localhost:3000/auth/confirm/${token}">Confirm</a>

    `
  })
}

module.exports = {welcomeMail}