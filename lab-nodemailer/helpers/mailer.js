const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth:{
    user:"fixtermailer@gmail.com",
    pass:"Superman77"
  }
})

function welcomeMail(email, name){
  transport.sendMail({
    bcc:email,
    subject:"Bienvenido a mi daily",
    from:"smma1992@gmail.com",
    html:`
    <h1>Bienvenido ${name}!</h1>
    <p>Estamos felices de tenerte!</p>
    `

  })
  .then(res=>{
    console.log(res)
  })
  .catch(err=>{
    console.log(e)
  })


}

module.exports = {welcomeMail}