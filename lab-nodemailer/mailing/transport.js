const nodemailer = require("nodemailer")
const dotenv = require('dotenv');
dotenv.config();


let transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});


module.exports = transport;