const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport({

  service:"hotmail",
  auth:{
    user:"rob_rene199027@hotmail.com",
    pass:"Pistaches1"
  }
})
function welcomeMail(email, message){
  transport.sendMail({
    to:email,
    subject: "Ironhack ejercicio",
    from:"rob_rene199027@hotmail.com",
    html: `
       
       <a href="http://localhost:3000/auth/confirm/${message}">Haz click aqui para confirmar</a>
       
       
       
       `
  })
  .then(res=>{
    console.log(res)
  }).catch(e=>{
    console.log(e)
  })
}
module.exports = {welcomeMail}