require("dotenv").config();
const nodemailer = require("nodemailer");

const transpoerter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SPASSWORD
  }
});
exports.sendConfirmation = (email, t) => {
  return transpoerter.sendMail({
    from: '"Yo" <yo@ironhack.com>',
    to: email,
    subject: "hey , confirm pls",
    html: `
    <h1>Enter to this link to confirm your email</h1>
    <p>http://localhost:3000/auth/confirm/${t}</p>
    `
  });
};
