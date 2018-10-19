const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth:{
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
}); 

exports.sendMail=(email, code, newUser)=>{
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Confirmation Email",
    html:`<h1>hola ${newUser}</h1><a href="http://localhost:4000/auth/confirm/${code}">Confirm your account</a>`
  })
  .then(info=>console.log(info))
  .catch(e=>console.log(e))
}