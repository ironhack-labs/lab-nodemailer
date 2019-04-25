const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.NMUSER,
    pass: process.env.NMPASS
  }
});

exports.sendConfirmationEmail = (email, token) => {
  return transporter
    .sendMail({
      from: '"The Best App" <email@brennedith.com>',
      to: email,
      subject: 'Please confirm your account',
      html: `
      <h1>Thanks for signing up!</h1>
      <p>Before you can login, we need to confirm you are not robot. <small>Not that we have something against them 😜️.</small></p> <p>Please <a href="http://localhost:3000/auth/confirm/${token}">click here</a> to activate your account!</p>
      `
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));
};
