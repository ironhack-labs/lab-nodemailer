require("dotenv").config();
const nodemailer = require("nodemailer");
console.log(process.env.USERNAME2, process.env.PASSWORD)

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USERNAME2,
    pass: process.env.PASSWORD
  }
});

module.exports = transporter;
