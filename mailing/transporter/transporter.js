const nodemailer=require('nodemailer');
const {USER_NAME,PASS}=process.env;


let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: USER_NAME,
      pass: PASS,
    }
  });

  module.exports={
      transporter
  }