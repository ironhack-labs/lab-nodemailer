const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SGPASS
  }
});

exports.sendMail = (email, token) => {
  return transporter.sendMail({
    from: '"Vel" < me@me.com>',
    to: email,
    subject: "Ya jaló OMG no lo puedo creer",
    html: `<h1>Click aquí</h1>
      <p>http://localhost:3000/auth/confirm/${token}</p> `
  });
};
