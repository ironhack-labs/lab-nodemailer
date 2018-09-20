const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:process.env.MAIL,
    pass:process.env.PASS
  }
})
exports.sendMail = (email,message,link)=>{
  transporter.sendMail({
    from:'Irving  :fire',
    to:email,
    subject:message,
    text:'Hola',
    html:link
  })
  .then(info=>console.log(info))
  .catch(e=>console.log(e))
}