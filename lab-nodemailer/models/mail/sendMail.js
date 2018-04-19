const mjmlUtils = require("mjml-utils");
const transporter = require("./transporterGmail");
const path = require("path");
const pathToHtmlEmailTemplate = path.join(
  __dirname,
  "./mail_templates/welcome_mail.html"
);
const Usermail = require ("")

        sendWellcomeMail.sendMail({
          from: `"My Awesome Project" <${from}>`,
          to: <${user.email}>
          subject: "Awesome Subject", // Asunto
          html: finalTemplate
        })
        .then(info => console.log(info));
   

module.exports = sendWellcomeMail;
