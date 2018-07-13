const nodemailer = require('nodemailer');
const env = require('dotenv');
env.config();
env.config({path: '../.env.private'});

console.log(process.env.USER_NAME,process.env.PASSWORD)

let transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: "pepe04444@gmail.com",
      pass: "m20684-m20684"
    }
  });


module.exports = transport;