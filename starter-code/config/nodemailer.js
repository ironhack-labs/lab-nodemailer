const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ullergmartin@gmail.com",
    pass: "popino123"
  }
});

module.exports = transporter;