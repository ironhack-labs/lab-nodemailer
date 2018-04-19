const mjmlUtils = require("mjml-utils");
const transporter = require("./transporterGmail");
const path = require("path");


const sendAwesomeMail = (to, confirmationCode, from = "myawesome@project.com") => {

      return transporter
        .sendMail({
          from: `"Page" <${from}>`,
          to,
          subject: "Awesome Subject", // Asunto
          text: `localhost:3000/auth/confirm/${confirmationCode}`
        })
        .then(info => console.log(info));
};
module.exports = sendAwesomeMail;