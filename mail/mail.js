require("dotenv").config({ path: ".private.env" });
const nodemailer = require("nodemailer");

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWD){

  throw new Error(
    "You have to configure mail credential in .private.env file."
    );
 }

let transporter = nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user: process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASSWD
  }
})

const sendMail= (to,sub,msg)=>{
  return transporter.sendMail({
    to,
    subject:sub,
    html:msg
  })
  .then(info=>console.log(info))
  .catch(error=>console.log(error))
}

module.exports=sendMail;