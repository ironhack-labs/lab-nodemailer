const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth:{
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

function welcomeMail(email, user){
  return transport.sendMail({
    to:email,
    subject: "Qué tranza!",
    from: "polloyon@pollito.com",
    html: `
      <h1>Bienvenido ${user.username}</h1>
      <p>Haz click en la siguiente liga o ábrela en tu navegador o ábrete</p>
      http://localhost:3000/auth/confirm/${user.confirmationCode}
    `
  }).then(res=>{
    console.log(res)
  }).catch(e=>{
    console.log(e)
  })
}

module.exports = {welcomeMail}