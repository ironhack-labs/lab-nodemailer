const mjmlUtils = require("mjml-utils");
const transporter = require("./transporterGmail");
const path = require("path");
const pathToHtmlEmailTemplate = path.join(
  __dirname,
  "./mail_templates/welcome_mail.html"
);

const sendAwesomeMail = (to,confirmationCode, variables, from = "myawesome@project.com") => {
  return mjmlUtils
    .inject(pathToHtmlEmailTemplate, variables)
    .then(finalTemplate => {
      console.log("FINAL TEMPLATE");

      return transporter
        .sendMail({
          from: `"My Awesome Project 👻" <${from}>`,
          to,
          subject: "Awesome Subject", // Asunto
          text: `http//:localhost:3000/confirm/${confirmationCode}`
          //html: finalTemplate
        })
        .then(info => console.log(info));
    });
};
module.exports = sendAwesomeMail;
