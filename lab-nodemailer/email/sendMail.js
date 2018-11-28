const transporter = require("./transport");
const fs = require("fs");
const path = require("path");
const hbs = require("handlebars");

const templateFile = path.join(__dirname, "./templates/mail_template.html");
const htmlstr = fs.readFileSync(templateFile).toString();
var template = hbs.compile(htmlstr);

const sendMail = (to, username,confirmationCode) => {
  return transporter
    .sendMail({
      from: "teresaromerodeveloper@gmail.com",
      to,
      subject:"Confirmacion de usuario",
      html: template({
        confirmationCode:confirmationCode,
        username:username
      })
    })
    .then(info => console.log(info));
};

module.exports = sendMail;
