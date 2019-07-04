require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SGUSER,
    pass: process.env.SGPASS
  }
});

exports.sendMail = (email, code) => {
  transporter
    .sendMail({
      from: `"Ironhack" <Ironhack@ironhack.com>`,
      to: email,
      subject: "Confirmation email code",
      html: `
    <h1> http://localhost:3000/auth/confirm/${code}

    </h1>
    `
    })
    .then(() => {
      console.log("email sent");
    })
    .catch(err => {
      console.log(err);
    });
};
