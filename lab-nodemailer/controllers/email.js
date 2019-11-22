const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user: process.env.EMAIL,
    pass:process.env.PASS
  }
});


exports.sendEmailView = (req,res) => {
  res.render("sendmail");
};

exports.sendEmail = async (email, subject, message) => {
  return await transporter.sendMail({
    from: "Ironhack Mex by Maria & Pablo <pruebabootcamp@gmail.com>",
    to: email,
    subject,
    text: message,
    html: `<b>${message}</b>`
  });

};