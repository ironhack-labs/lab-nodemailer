const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const { transporter } = require("./transporter");

const sendMail = (to, subject, data) => {
  return transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: data.url,
      html: `<b><a href="${data.url}">Confirm your account</a></b>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};

module.exports = { sendMail };
