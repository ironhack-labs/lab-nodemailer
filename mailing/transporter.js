const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = { transporter };
