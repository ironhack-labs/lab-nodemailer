const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const nodemailer = require("nodemailer");


const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = {transport};