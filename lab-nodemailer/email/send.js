require("dotenv").config({ path: ".private.env" });
const nodemailer = require("nodemailer");

if (!process.env.MAIL_USER || !process.env.PASS_USER) {
  throw new Error(
    "You have to configure mail credentials in .private.env file."
  );
}

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.PASS_USER
  }
});

const sendMail = (to, subject, message) => {
  return transporter
    .sendMail({
      to,
      subject,
      html: `<b>${message}</b>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};

module.exports = sendMail;
