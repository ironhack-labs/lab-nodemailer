require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  }
});

module.exports = transporter;
