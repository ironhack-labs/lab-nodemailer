const dotenv=require('dotenv');
dotenv.config();
dotenv.config({path: './env.private'});

const nodemailer=require('nodemailer');
//var smtpTransport = require('nodemailer-smtp-transport');

const { USER_NAME,PASS }=process.env;



let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user:'pepe04444@gmail.com',
      pass:'m20684-m20684',
    }
  });

  module.exports={
      transporter
  }