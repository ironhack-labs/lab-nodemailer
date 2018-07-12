const env = require('dotenv');
env.config();
env.config({path: './.env.private'});

const mjml = require('mjml');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const { transporter } = require("./transporter");

const sendMail = (to, subject, data) => {
  const templatePath = path.join(__dirname, "./templates/mail.mjml");
  const templateFile = fs.readFileSync(templatePath, "utf8");
  const { html } = mjml(templateFile, {});
  const templateData = hbs.compile(html);
  const compiledHTML = templateData(data);

  return transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: compiledHTML
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};

module.exports = { sendMail };
