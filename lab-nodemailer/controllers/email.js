const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});


exports.sendEmail = async (email, subject, message) => {
  return await transporter.sendMail({
    from: "Me from tha past <mariasantosm91@hotmail.com>",
    to: email,
    subject,
    text: message,
    html: `<b>${message}</b>`
  });
};