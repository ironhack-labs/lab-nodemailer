const nodemailer = require ('nodemailer')
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth:{
    user: "fernando.heba11@gmail.com",
    pass: "external1"
  }
})

function welcomeMail(name,email,token){
  transport.sendMail({
    bcc:email,
    subject:"Confirma tu correo",
    from:"LATIN LOVER 69",
    html:`
    <h1>Bienvenido a ${name}</h1>
    <p>Da click en la siguiente liga para confirmar tu correo </p>
    <a href = "http://localhost:3000/auth/confirm/${token}">Click aqui </p>
    `
  })
  .then (res => {
    console.log(res)
  })
  .catch(err=>{
    console.log(err)
  })
}

module.exports= {welcomeMail}