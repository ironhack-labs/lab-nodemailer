require('dotenv').config({path: '.private.env'});
const nodemailer = require('nodemailer');


if(!process.env.USER_ID || ! process.env.PASSW_ID ){
  throw new Error("You have to configure mail credentials in .private.env file.");
}

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_ID,
    pass: process.env.PASSW_ID 
  }
});



const sendMail = (to, message)=>{
  return transporter.sendMail({
    to, 
    subject: 'From Jacob - David', 
    html: `<b>${message}</b>`
  })
  .then(info => console.log(info))
  .catch(error => console.log(error))
}


module.exports = sendMail;